angular.module('atlas.client', [
		'ngResource',
	])
	
	/******************************************************************************************************************
	APP CONFIG ********************************************************************************************************
	*******************************************************************************************************************/
	.config(['oauthProvider', 'taskServiceClientProvider', 'orgModelServiceClientProvider', 'cmsServiceClientProvider', function (oauthProvider, taskServiceClientProvider, orgModelServiceClientProvider, cmsServiceClientProvider) {
		oauthProvider.config([
			{ 
				name: 'default', 
				uri: 'http://atlas-id.azurewebsites.net:80/api/', 
				credentials: { username: 'DCMS_OPERATOR', password: 'DCMS_OPERATOR' },
				active: true, 
			}
		]);
		taskServiceClientProvider.config({
			uri: 'http://atlas-tasks.azurewebsites.net/api/',
			securityType: 'oauth2',
			oauth2: {
				providerName: 'default',
			},
		});
		orgModelServiceClientProvider.config({
			uri: 'http://atlas-orgmodel.azurewebsites.net/api/',
			securityType: 'oauth2',
			oauth2: {
				providerName: 'default',
			},
		});
		cmsServiceClientProvider.config({
			uri: 'http://atlas-cmis.azurewebsites.net/api/',
			securityType: 'oauth2',
			oauth2: {
				providerName: 'default',
			},
		});
	}])
	
	/******************************************************************************************************************
	APP RUN ***********************************************************************************************************
	*******************************************************************************************************************/
	//.run(['$rootScope', function ($rootScope) {
	//}])
	
	/******************************************************************************************************************
	INFRASTRUCTURE SERVICES/FACTORIES *********************************************************************************
	*******************************************************************************************************************/
	/**
	 * @ngdoc provider
	 * @name oauthProvider
	 * @description
	 * Use `oauthProvider` to change the default behavior of the {@link oauth} service.
	 * */
	.provider('oauth', [function() {
		var providers = [];
		
		return {
			/**
			 * @ngdoc method
			 * @name oauthProvider#config
			 * @description
			 *
			 * Configure oauth service to initialize the list of providers.
			 *
			 * @param {Array} list A list of providers to initialize the list of providers.
			 *
			 * @returns {Object} Returns the oauthProvider for chaining.
			 **/
			config: function(list) {
				if (angular.isArray(list)) {
					providers = list;
				}
				return this;
			},
			/**
			 * @ngdoc service
			 * @name oauth
			 *
			 * @description
			 * `oauth` service is the registry for the supported [OAuth](http://en.wikipedia.org/wiki/OAuth) providers.
			 * Used for token creation and refresh from service clients that are configured with securityType `oauth2`.
			 *
			 * ## General usage
			 * `oauth` service ...
			 *
			 * ```js
			 *   // Simple example :
			 *   var provider = oauth.getProvider('default');
			 * ```
			 **/
			$get: [function() { 
				return {
					/**
					 * @ngdoc method
					 * @name oauth#getProvider
					 * @param {string=} name The user-friendly name of the provider.
					 * @returns {Object} If found the provider with the given name. Otherwise, returns null. 
					 *    The response object has following properties:
					 *    -  **name** – `{string}` – The user-friendly name of the provider.
					 *    -  **uri** – `{string}` – The absolute URL of the Atlas Identity Service.
					 *    -  **credentials** – `{Object}` – The credentials that are used to obtain a token from the 
					 *		 Atlas Identity Service. Usually this is useful during development.
					 *    -  **active** – `{boolean}` – If true, the provider is active.
					 */
					getProvider: function(name) {
						for (var i = 0; i < providers.length; i++)
							if (list[i].name == name)
								return list[i];
						return null;
					},
				};
			}],
		};
	}])
	
	.factory('oauthTokenService', ['$q', '$resource', function($q, $resource) {
		return {
			createToken: function(baseUri, credentials) {
				var deferred = $q.defer();
				var tokenResource = $resource(baseUri + 'auth/tokens');
				var tokenRs = new tokenResource({
					granttype: "password", 
					username: credentials.username,
					password: credentials.password
				});
				tokenRs.$save()
					.then(function(rs) {
						console.log('get token for ' + credentials.username);
						rs.status = 200;
						deferred.resolve(rs);
					})
					.catch(function(rs) {
						deferred.resolve(rs);
					});
				return deferred.promise;
			},
			refreshToken: function(baseUri, refreshToken) {
				var deferred = $q.defer();
				var tokenResource = $resource(baseUri + 'auth/tokens');
				var tokenRs = new tokenResource({
					granttype: "refresh_token", 
					refreshtoken : refreshToken
				});
				tokenRs.$save()
					.then(function(rs) {
						rs.status = 200;
						deferred.resolve(rs);
					})
					.catch(function(rs) {
						deferred.resolve(rs);
					});
				return deferred.promise;
			},
			deleteToken: function(baseUri, refreshToken) {
				var deferred = $q.defer();
				var tokenResource = $resource(baseUri + 'auth/tokens/' + refreshToken);
				var tokenRs = new tokenResource({});
				tokenRs.$delete()
					.then(function(rs) {
						rs.status = 200;
						deferred.resolve(rs);
					})
					.catch(function(rs) {
						deferred.resolve(rs);
					});
				return deferred.promise;
			},
		}
	}])
	
	.factory('serviceBuilder', ['$q', '$window', 'oauth', 'oauthTokenService', function($q, $window, oauth, oauthTokenService) {
		var http401 = {
			//response: function (result) {
			//	return result.data;
			//},
			responseError: function (rejection) {
				if (rejection.status == 401) {
					console.warn('Failed with ' + rejection.status + ' status.');
					var providerName = rejection.config.oauth2ProviderName;
					if (providerName) {
						var tokens = getCachedTokens(providerName);
						if (tokens && tokens.refresh_token) {
							console.warn('Trying to refresh the token for provider [' + providerName + '].');
							var provider = oauth.getProvider(providerName);
							if (provider) {
								oauthTokenService.refreshToken(provider.uri, tokens.refresh_token)
									.then(function(tokens) {
										setCachedTokens(providerName, tokens);
									});
							}
						}
						else {
							setCachedTokens(providerName, null);
						}
					}
				}
				return $q.reject(rejection);
			}
		};
		
		// #REFACTOR: this two methods could be a new autonomous service
		var getCachedTokens = function(name) {
			var tokens = $window.sessionStorage.getItem('oauth_tokens_' + name);
			return JSON.parse(tokens);
		};
		var setCachedTokens = function(name, tokens) {
			if (tokens) {
				$window.sessionStorage.setItem('oauth_tokens_' + name, JSON.stringify(tokens));
			}
			else {
				$window.sessionStorage.removeItem('oauth_tokens_' + name);
			}
		};
		
		return {
			getServiceInfo: function(serviceConfig) {
				var deferred = $q.defer();
				var template = { headers: {} };
				var info = { 
					baseUri: serviceConfig.uri, 
					action: function(target) {
						var obj = angular.copy(target);
						
						for (var prop in template) {
							obj[prop] = template[prop];
						}
						return obj;
					}
				};
				if (serviceConfig.securityType == 'oauth2') { 
					var providerName = serviceConfig.oauth2.providerName;
					template.oauth2ProviderName = providerName;
					
					var tokens = getCachedTokens(providerName);
					if (tokens) {
						template.headers.Authorization = "Bearer " + tokens.access_token;
						template.interceptor = http401;
						deferred.resolve(info);
					}
					else {
						var provider = getProvider(providerName);
						if (provider == null)
							deferred.reject('No provider ' + providerName);
						oauthTokenService
							.createToken(provider.uri, provider.credentials)
							.then(function(tokens) {
								setCachedTokens(providerName, tokens);
								template.headers.Authorization = "Bearer " + tokens.access_token;
								template.interceptor = http401;
								deferred.resolve(info);
							}, function(err) {
								deferred.reject(err);
							});
					}
				}
				else {
					deferred.resolve(info);
				}
				return deferred.promise;
			}
		}
	}])
	
	.factory('resourceBuilder', ['$q', '$resource', 'serviceBuilder', function($q, $resource, serviceBuilder) {
		var decorateActions = function(info, actions) {
			var result = {};
			if (actions) {
				for (var prop in actions) {
					result[prop] = info.action(actions[prop]);
				}
			}
			return result;
		};
		var buildResource = function(serviceConfig, resourceUri, paramDefaults, actions) {
			var deferred = $q.defer();
			serviceBuilder.getServiceInfo(serviceConfig).then(function(info) {
				var resource = $resource(info.baseUri + resourceUri, paramDefaults, decorateActions(info, actions));
				deferred.resolve(resource);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		};
		return {
			build: buildResource,
		};
	}])
	

	/******************************************************************************************************************
	ORGANIZATION MODEL SERVICE CLIENT *********************************************************************************
	*******************************************************************************************************************/
	.provider('orgModelServiceClient', [function() {
		var serviceConfig = null;
		
		return {
			config: function(data) { 
				serviceConfig = data; 
			},
			$get: ['resourceBuilder', function(resourceBuilder) { 
				var getUserResource = function() { 
					return resourceBuilder.build(serviceConfig, 'users/:id', { id: '@id' }, {
						'query': { method:'GET' },
						'create': { method:'POST' },
						'update': { method:'PUT' },
						'delete': { method:'DELETE' },
					});
				};
				var getGroupResource = function() { 
					return resourceBuilder.build(serviceConfig, 'groups/:id', { id: '@id' }, {
						'query': { method:'GET' },
						'create': { method:'POST' },
					});
				};
				var getGroupUsersResource = function(groupId) { 
					return resourceBuilder.build(serviceConfig, 'groups/:groupId/users/:userId', { groupId: groupId, userId: '@userId' }, {
						'query': { method:'GET', isArray:true },
						'append': { method:'PUT' },
						'remove': { method:'DELETE' },
					});
				};
				var getUnitResource = function() { 
					return resourceBuilder.build(serviceConfig, 'units/:id', { id: '@id' }, {
						'query': { method:'GET', isArray:true },
						'create': { method:'POST' },
						'update': { method:'PUT' },
					});
				};
				var getUnitChildrenResource = function() { 
					return resourceBuilder.build(serviceConfig, 'units/:id/children', { id: '@id' }, {
						'query': { method:'GET', isArray: true },
					});
				};
				
				var theService = {
					/***************************************** USERS *****************************************/
					queryUsers: function(username, success, error) {
						if (typeof(arguments[0]) === "function") {
							error = success;
							success = username;
							username = null;
						}
						var params = null;
						if (username) params = { "username": username };
						getUserResource().then(function(theResource) {
							theResource.query(params, success, error);
						}, error);
					},
					createUser: function(data, success, error) {
						getUserResource().then(function(theResource) {
							var payload = new theResource(data);
							payload.$create().then(success, error);
						}, error);
					},
					updateUser: function(data, success, error) {
						getUserResource().then(function(theResource) {
							var resourceId = data.Id;
							// #REFACTOR to accept and ignore readonly properties like Id, ParentId, etc
							delete data.Id; 
							// #REFACTOR to accept Properties as JSON
							if (data.Properties) data.Properties = JSON.stringify(data.Properties); 
							var payload = new theResource(data);
							payload.$update({ id: resourceId }, success, error);
						}, error);
					},
					deleteUser: function(userId, success, error) {
						// #REFACTOR support delete user
						getUserResource().then(function(theResource) {
							var payload = new theResource();
							payload.$delete({ id: userId }).then(success, error);
						}, error);
					},
					/***************************************** GROUPS *****************************************/
					queryGroups: function(name, success, error) {
						var params = null;
						if (name) params = { "name": name };
						getGroupResource().then(function(theResource) {
							theResource.query(params, success, error);
						}, error);
					},
					createGroup: function(data, success, error) {
						getGroupResource().then(function(theResource) {
							var payload = new theResource(data);
							payload.$create().then(success, error);
						}, error);
					},
					getOrCreateGroupByName: function(name, data, success, error) {
						theService.queryGroups(name, function(groups) {
							if (groups && groups.Items && groups.Items.length) {
								success(groups.Items[0]);
							}
							else {
								if (!data) data = { Name: name };
								if (!data.Name) data.Name = name;
								theService.createGroup(data, success, error);
							}
						}, error);
					},
					queryGroupMembers : function(groupId, success, error) {
						getGroupUsersResource(groupId).then(function(theResource) {
							theResource.query(success, error);
						}, error);
					},
					queryGroupMembersByName : function(name, success, error) {
						theService.queryGroups(name, function(groups) {
							if (groups && groups.Items && groups.Items.length) {
								theService.queryGroupMembers(groups.Items[0].Id, success, error);
							}
							else {
								success([]);
							}
						}, error);
					},
					appendGroupMembers: function(groupId, userId, success, error) {
						getGroupUsersResource(groupId).then(function(theResource) {
							var userIds = (userId.constructor === Array ? userId : [ userId ]);
							theResource.append({}, userIds, success, error);
						}, error);
					},
					removeGroupMembers: function(groupId, userId, success, error) {
						getGroupUsersResource(groupId).then(function(theResource) {
							var payload = new theResource(userId);
							theResource.remove({ groupId: groupId, userId: userId }, success, error);
						}, error);
					},
					/**************************************** UNITS ******************************************/
					queryUnits: function(success, error) {
						getUnitResource().then(function(theResource) {
							theResource.query(success, error);
						}, error);
					},
					createUnit: function(data, success, error) {
						getUnitResource().then(function(theResource) {
							var payload = new theResource(data);
							payload.$create().then(success, error);
						}, error);
					},
					updateUnit: function(data, success, error) {
						getUnitResource().then(function(theResource) {
							var resourceId = data.Id;
							// #REFACTOR to accept and ignore readonly properties like Id, ParentId, etc
							delete data.Id; 
							// #REFACTOR to accept Properties as JSON
							if (data.Properties) data.Properties = JSON.stringify(data.Properties); 
							var payload = new theResource(data);
							payload.$update({ id: resourceId }).then(success, error);
						}, error);
					},
					queryUnitChildren: function(unitId, success, error) {
						getUnitChildrenResource().then(function(theResource) {
							theResource.query({ id: unitId }, success, error);
						}, error);
					},
				};
				return theService;
			}]
		};
	}])
	
	/******************************************************************************************************************
	CONTENT MANAGEMENT SERVICE CLIENT *********************************************************************************
	*******************************************************************************************************************/
	.provider('cmsServiceClient', [function() {
		var serviceConfig = null;
		
		return {
			config: function(data) { 
				serviceConfig = data; 
			},
			$get: ['resourceBuilder', function(resourceBuilder) { 
				var getRepositoryResource = function() { 
					return resourceBuilder.build(serviceConfig, 'repositories/:id', { id: '@id' }, {
						'query': { method:'GET' },
						'create': { method:'POST' },
						'update': { method:'PUT' },
						'delete': { method:'DELETE' },
					});
				};
				var getRepositoryTypeResource = function() {
					return resourceBuilder.build(serviceConfig, 'repositories/:repoId/types/:objTypeId', { repoId: '@repoId', objTypeId: '@objTypeId' }, {
						'get': { method:'GET', params: { objTypeId: 0 } },
						'query': { method:'GET' },
						'create': { method:'POST' },
						'update': { method:'PUT' },
						'delete': { method:'DELETE' },
					});
				};
				var getRepositoryTypeChildrenResource = function() {
					return resourceBuilder.build(serviceConfig, 'repositories/:repoId/typechildren/:objTypeId', { repoId: '@repoId', objTypeId: '@objTypeId' }, {
						'get': { method:'GET', params: { objTypeId: 0 } },
						'query': { method:'GET' },
						'create': { method:'POST' },
					});
				};
				var getRepositoryTypeDescendantResource = function() {
					return resourceBuilder.build(serviceConfig, 'repositories/:repoId/typedescendants/:objTypeId', { repoId: '@repoId', objTypeId: '@objTypeId' }, {
						'get': { method:'GET', params: { objTypeId: 0 } },
						'query': { method:'GET' },
					});
				};
				
				var theService = {
					queryRepositories: function(page, pageSize, success, error) {
						if (typeof(arguments[0]) === "function") {
							error = pageSize;
							success = page;
							pageSize = null;
							page = null;
						}
						else if (typeof(arguments[1]) === "function") {
							error = success;
							success = pageSize;
							pageSize = null;
						}
						var params = null;
						if (page) params = angular.extend(params || {}, { page: page });
						if (pageSize) params = angular.extend(params || {}, { pageSize: pageSize });
						
						getRepositoryResource().then(function(theResource) {
							theResource.query(params, success, error);
						}, error);
					},
					getRepositoryByName: function(name, success, error) {
						_getRepositoryByName(1, name, success, error);
					},
					createRepository: function(data, success, error) {
						getRepositoryResource().then(function(theResource) {
							var payload = new theResource(data);
							payload.$create().then(success, error);
						}, error);
					},
					updateRepository: function(data, success, error) {
						getRepositoryResource().then(function(theResource) {
							var payload = new theResource(data);
							payload.$update({ id: data.Id }, success, error);
						}, error);
					},
					deleteRepository: function(id, success, error) {
						// #REFACTOR support delete repository
						getRepositoryResource().then(function(theResource) {
							var payload = new theResource();
							payload.$delete({ id: id }).then(success, error);
						}, error);
					},
					/* params: { repoId, [objTypeId], [depth], [includePropertyDefinitions] } */
					getObjectTypes: function(params, success, error) {
						if (params.repoId) {
							getRepositoryTypeDescendantResource().then(function(theResource) {
								theResource.query(params, function(result) {
									success(result.items);
								}, error);
							}, error);
						}
						else {
							error('getObjectTypes: The repoId parameter is required.');
						}
					},
					/* params: { repoId, [parentId], typeData } */
					createObjectType: function(params, success, error) {
						if (!params.parentId && !params.typeData.ParentId)
							error('createObjectType: The parentId is required');
						else if (!params.repoId)
							error('createObjectType: The repoId parameter is required');
						else if (!params.typeData)
							error('createObjectType: The typeData parameter is required');
						else {
							getRepositoryTypeChildrenResource().then(function(theResource) {
								if (params.parentId) params.typeData.ParentId = params.parentId;
								var payload = new theResource(params.typeData);
								payload.$create({ repoId: params.repoId }, success, error);
							}, error);
						}
					},
					/* params: { repoId, [objectTypeId], typeData } */
					updateObjectType: function(params, success, error) {
						if (!params.objectTypeId && !params.typeData.Id)
							error('updateObjectType: The id is required');
						else if (!params.repoId)
							error('updateObjectType: The repoId parameter is required');
						else if (!params.typeData)
							error('updateObjectType: The typeData parameter is required');
						else {
							getRepositoryTypeResource().then(function(theResource) {
								if (params.objectTypeId) params.typeData.Id = params.objectTypeId;
								var payload = new theResource(params.typeData);
								payload.$update({ repoId: params.repoId, objTypeId: params.typeData.Id }, success, error);
							}, error);
						}
					},
				};
				return theService;
			}],
		};
	}])
	
	/******************************************************************************************************************
	HUMAN TASK SERVICE CLIENT *****************************************************************************************
	*******************************************************************************************************************/
	.provider('taskServiceClient', [function() {
		var serviceConfig = null;
		
		return {
			config: function(data) { 
				serviceConfig = data; 
			},
			$get: ['resourceBuilder', function(resourceBuilder) { 
				var getTaskSpecificationResource = function() { 
					return resourceBuilder.build(serviceConfig, 'taskSpecifications/:id', { id: '@id' }, {
						'query': { method:'GET' },
						'create': { method:'POST' },
						//'update': { method:'PUT' },
						//'delete': { method:'DELETE' },
					});
				};
				var getTaskResource = function() { 
					return resourceBuilder.build(serviceConfig, 'tasks/:id', { id: '@id' }, {
						//'query': { method:'GET' },
						'create': { method:'POST' },
						//'update': { method:'PUT' },
						//'delete': { method:'DELETE' },
					});
				};
				var getTaskSummaryResource = function() { 
					return resourceBuilder.build(serviceConfig, 'taskSummaries', {}, {
						'query': { method:'GET' },
						//'create': { method:'POST' },
						//'update': { method:'PUT' },
						//'delete': { method:'DELETE' },
					});
				};
				
				var _getByCriteria = function(query, selector, page, success, error) {
					query(page, function(result) {
						var list = result ? result.Items : null;
						if (list) {
							var item = null;
							for (var i = 0; i < list.length; i++) {
								if (selector(list[i])) {
									item = list[i];
									break;
								}
							}
							if (item != null) {
								success(item);
							}
							else if (list.page < list.numPages) {
								_getByCriteria(list.page + 1, name, success, error);
							}
							else {
								success(null);
							}
						}
						else {
							success(null);
						}
					}, error);
				};
				
				var theService = {
					/** TASK SPECIFICATIONS *******************************************/
					queryTaskSpecifications: function(page, pageSize, success, error) {
						if (typeof(arguments[0]) === "function") {
							error = pageSize;
							success = page;
							pageSize = null;
							page = null;
						}
						else if (typeof(arguments[1]) === "function") {
							error = success;
							success = pageSize;
							pageSize = null;
						}
						var params = null;
						if (page) params = angular.extend(params || {}, { page: page });
						if (pageSize) params = angular.extend(params || {}, { pageSize: pageSize });
						
						getTaskSpecificationResource().then(function(theResource) {
							theResource.query(params, success, error);
						}, error);
					},
					getOrCreateTaskSpecification: function(name, definition, success, error) {
						_getByCriteria(theService.queryTaskSpecifications, function(item) { return item.Name == name }, 1, function(taskSpec) {
							if (taskSpec) {
								success(taskSpec);
							}
							else {
								theService.createTaskDefinition(definition, function(taskSpec) {
									success(taskSpec);
								}, error);
							}
						}, error);
					},
					createTaskDefinition: function(definition, success, error) {
						getTaskSpecificationResource().then(function(theResource) {
							var specification = {
								Name: definition.Name,
								Definition: definition
							};
							var payload = new theResource(specification);
							payload.$create(success, error);
						}, error);
					},
					/** TASKS *******************************************/
					createTask: function(data, success, error) {
						getTaskResource().then(function(theResource) {
							var payload = new theResource(data);
							payload.$create(success, error);
						}, error);
					},
					/** TASK SUMMARIES *******************************************/
					queryTaskSummaries: function(params, success, error) {
						if (typeof(arguments[0]) === "function") {
							error = success;
							success = params;
							params = {};
						}
						getTaskSummaryResource().then(function(theResource) {
							theResource.query(params, success, error);
						}, error);
					}
				};
				
				return theService; 
			}]
		};
	}])
	
	