angular.module('atlas.client', [
		'ngResource',
	])
	
	/******************************************************************************************************************
	APP CONFIG ********************************************************************************************************
	*******************************************************************************************************************/
	.config(['oauthProvider', 'taskServiceProvider', function (oauthProvider, taskServiceProvider) {
		oauthProvider.config([
			{ 
				name: 'default', 
				uri: 'http://atlas-id.azurewebsites.net:80/api/', 
				credentials: { username: 'JohnDoe', password: 'JohnDoe' },
				active: true, 
			}
		]);
		taskServiceProvider.config({
			uri: 'http://atlas-tasks.azurewebsites.net/api/',
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
	.provider('oauth', [function() {
		var providers = [];
		
		return {
			config: function(list) {
				providers = list;
			},
			$get: function() {
				return {
					providers: providers, // {name, uri}
				};
			}
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
		var getUriForName = function(name) {
			var list = oauth.providers;
			if (list && list.length) {
				for (var i = 0; i < list.length; i++)
					if (list[i].name == name)
						return list[i].uri;
			}
			return null;
		};
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
							var baseUri = getUriForName(providerName);
							oauthTokenService.refreshToken(baseUri, tokens.refresh_token)
								.then(function(tokens) {
									setCachedTokens(providerName, tokens);
								});
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
						var baseUri = getUriForName(providerName);
						if (baseUri == null)
							deferred.reject('No URI for provider ' + providerName);
						oauthTokenService
							.createToken(baseUri, { username: 'JohnDoe', password: 'JohnDoe'})
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
	HUMAN TASK SERVICE CLIENT *****************************************************************************************
	*******************************************************************************************************************/
	.provider('taskService', [function() {
		var serviceConfig = null;
		
		return {
			config: function(data) { 
				serviceConfig = data; 
			},
			$get: ['resourceBuilder', function(resourceBuilder) { 
				var getTaskSpecificationResource = function() { 
					return resourceBuilder.build(serviceConfig, 'taskSpecifications/:id', { id: '@id' }, {
						//'query': { method:'GET' },
						'create': { method:'POST' },
						//'update': { method:'PUT' },
						//'delete': { method:'DELETE' },
					});
				};
				var getTaskResource = function() { 
					return resourceBuilder.build(serviceConfig, 'taskSummaries/:id', { id: '@id' }, {
						//'query': { method:'GET' },
						'create': { method:'POST' },
						//'update': { method:'PUT' },
						//'delete': { method:'DELETE' },
					});
				};
				var getTaskSummaryResource = function() { 
					return resourceBuilder.build(serviceConfig, 'taskSummaries/:id', { id: '@id' }, {
						'query': { method:'GET' },
						//'create': { method:'POST' },
						//'update': { method:'PUT' },
						//'delete': { method:'DELETE' },
					});
				};
				
				var theService = {
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
					createTask: function(data, success, error) {
						getTaskResource().then(function(theResource) {
							var payload = new theResource(data);
							payload.$create(success, error);
						}, error);
					},
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
	
	