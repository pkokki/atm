angular.module('dcms', [
		'ui.router', 
		'ngMaterial',
		'ngMessages',
	])
	.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', '$mdIconProvider', function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider) {
		//$mdThemingProvider.theme('altTheme')
		//	.primaryPalette('blue')
		//	.accentPalette('indigo')
		//	.warnPalette('red')
		//	.backgroundPalette('grey');
		//$mdThemingProvider.setDefaultTheme('altTheme');
		
		$mdIconProvider
			.iconSet('social', '/assets/img/social-icons.svg', 24)
			.iconSet('device', '/assets/img/device-icons.svg', 24)
			.iconSet('communication', '/assets/img/communication-icons.svg', 24)
			.defaultIconSet('/assets/img/core-icons.svg', 24);

		$urlRouterProvider
			.when("/dcms", "/dcms/home")
			.when("/dcms/workspace", "/dcms/workspace/inbox/")
			.when("/dcms/workspace/inbox", "/dcms/workspace/inbox/")
			;
		
		$stateProvider
			.state('dcms', {
				abstract: true,
				url: '/dcms',
				templateUrl: '/components/dcms/dcms.html',
				controller: 'DcmsController',
			})
			.state('dcms.home', { url: '/home', templateUrl: '/components/dcms/home.html', })
			
			.state('dcms.setup', { url: '/setup', templateUrl: '/components/dcms/setup.html', })
			.state('dcms.setup.authentication', {
				url: '/authentication', 
				templateUrl: '/components/dcms/setup.authentication.html', 
				controller: 'DcmsSetupAuthenticationController',
			})
			.state('dcms.setup.authentication.newOauthProvider', {
				url: '/newOauthProvider', 
				templateUrl: '/components/dcms/setup.authentication.newOauthProvider.html', 
			})
			.state('dcms.setup.authentication.testOauthProvider', {
				url: '/testOauthProvider/:providerName', 
				templateUrl: '/components/dcms/setup.authentication.testOauthProvider.html', 
				controller: 'DcmsSetupAuthenticationTestOauthProviderController',
			})
			
			.state('dcms.setup.omOrganization', { 
				url: '/omOrganization', 
				templateUrl: '/components/dcms/setup.omOrganization.html', 
				controller: 'DcmsSetupOmOrganizationController',
			})
			.state('dcms.setup.omUsers', { 
				url: '/omUsers', 
				templateUrl: '/components/dcms/setup.omUsers.html', 
				controller: 'DcmsSetupOmUsersController',
			})
			.state('dcms.setup.omUnits', { url: '/omUnits', templateUrl: '/components/dcms/setup.omUnits.html', })
			.state('dcms.setup.omMembership', { 
				url: '/omMembership', 
				templateUrl: '/components/dcms/setup.omMembership.html', 
				controller: 'DcmsSetupOmMembershipController',
			})
			.state('dcms.setup.omCollectors', { url: '/omCollectors', templateUrl: '/components/dcms/setup.omCollectors.html', })
			.state('dcms.setup.omSecurity', { url: '/omSecurity', templateUrl: '/components/dcms/setup.omSecurity.html', })
			.state('dcms.setup.domReceivables', { url: '/domReceivables', templateUrl: '/components/dcms/setup.domReceivables.html', })
			.state('dcms.setup.repository', { 
				url: '/repository', 
				templateUrl: '/components/dcms/setup.repository.html', 
				controller: 'DcmsSetupRepositoryController',
			})
			.state('dcms.setup.infoSnippets', { 
				url: '/infoSnippets', 
				templateUrl: '/components/dcms/setup.infoSnippets.html', 
				controller: 'DcmsSetupInfoSnippetsController',
			})
			.state('dcms.setup.bpTasks', { url: '/bpTasks', templateUrl: '/components/dcms/setup.bpTasks.html', })
			.state('dcms.setup.bpComments', { url: '/bpComments', templateUrl: '/components/dcms/setup.bpComments.html', })
			.state('dcms.setup.bpHistory', { url: '/bpHistory', templateUrl: '/components/dcms/setup.bpHistory.html', })
			.state('dcms.setup.cmCorrespondence', { url: '/cmCorrespondence', templateUrl: '/components/dcms/setup.cmCorrespondence.html', })
			.state('dcms.setup.cmTemplates', { url: '/cmTemplates', templateUrl: '/components/dcms/setup.cmTemplates.html', })
			.state('dcms.setup.solution', { url: '/solution', templateUrl: '/components/dcms/setup.solution.html', })
			
			.state('dcms.workspace', { url: '/workspace', templateUrl: '/components/dcms/workspace.html', })
			.state('dcms.workspace.inbox', { 
				url: '/inbox/:wq', 
				templateUrl: '/components/dcms/workspace.inbox.html',
				controller: 'DcmsWorkspaceInboxController',				
			})
			.state('dcms.workspace.inboxItem', { 
				url: '/inbox/:wq/:id', 
				templateUrl: '/components/dcms/workspace.inboxItem.html',
				controller: function($scope, $stateParams) { $scope.wq = $stateParams.wq || 'my'; $scope.id = $stateParams.id; },
			})
			.state('dcms.workspace.admin', { url: '/admin', templateUrl: '/components/dcms/workspace.admin.html', })
			.state('dcms.workspace.adminSettings', { url: '/admin/settings', templateUrl: '/components/dcms/workspace.adminSettings.html', })
		;
	}])
	
	/******************************************************************************************************************
	APP RUN ***********************************************************************************************************
	*******************************************************************************************************************/
	.run(['$rootScope', function ($rootScope) {
		//$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
		//});
	}])
	
	/******************************************************************************************************************
	SERVICES/FACTORIES ************************************************************************************************
	*******************************************************************************************************************/
	.factory('setup', [function() {
		var setup = {
			oauthProviders: [
				{ 
					name: 'default', 
					uri: 'http://atlas-id.azurewebsites.net:80/api/', 
					credentials: { username: 'JohnDoe', password: 'JohnDoe' },
					active: true, 
				}
			],
			services: {
				omSrv: {
					uri: 'http://atlas-orgmodel.azurewebsites.net/api/',
					securityType: 'oauth2',
					oauth2: {
						providerName: 'default',
					},
				},
				caseSrv: {
					uri: 'http://atlas-cases.azurewebsites.net/api/',
				},
				taskSrv: {
					uri: 'http://atlas-tasks.azurewebsites.net/api/',
				},
				templateSrv: {
					uri: 'http://atlas-templates.azurewebsites.net/api/',
				},
				ruleSrv: {
					uri: 'http://atlas-de.azurewebsites.net/api/',
				},
				cmsSrv: {
					uri: 'http://atlas-cmis.azurewebsites.net/api/',
					securityType: 'oauth2',
					oauth2: {
						providerName: 'default',
					},
					dcmsRepository: '#DCMS',
					infoSnippetType: {
						Name: '#DcmsInfoSnippet',
						BaseId: 'Document',
						Description: 'Abstract info snippet document type',
						DisplayName: '#DcmsInfoSnippet',
						QueryName: '#DcmsInfoSnippet',
						IsCreatable: false,
					},
					predefinedInfoSnippetType: {
						Name: '#DcmsPredefinedInfoSnippet',
						BaseId: 'Document',
						Description: 'Base document type for predefined info snippets',
						DisplayName: '#DcmsPredefinedInfoSnippet',
						QueryName: '#DcmsPredefinedInfoSnippet',
					},
					customInfoSnippetType: {
						Name: '#DcmsCustomInfoSnippet',
						BaseId: 'Document',
						/*Description: '',*/
						DisplayName: '#DcmsCustomInfoSnippet',
						QueryName: '#DcmsCustomInfoSnippet',
					},
				},
				bsSrv: {
					uri: 'http://atlas-business.azurewebsites.net/api/',
				},
			},
			locations: {
				rootUnitName: '#LOCATIONS',
			},
			groups: {
				dcmsUsers: '#DCMS_USERS',
			},
			permissions: {
				sets: [ 
					{ id: '1', name: 'Collections Agent' },
					{ id: '2', name: 'Collections Manager' },
				],
			},
			infoSnippets: {
				types: [
					{ name: 'DcmsAccount', displayName: 'Collections Account', description: '', active: false },
					{ name: 'DcmsAdjustment', displayName: 'Collections Adjustment', description: '', active: false },
					{ name: 'DcmsBankruptcy', displayName: 'Collections Bankruptcy', description: '', active: false },
					{ name: 'DcmsBillTo', displayName: 'Collections Bill To', description: '', active: false },
					{ name: 'DcmsCases', displayName: 'Collections Cases', description: '', active: false },
					{ name: 'DcmsDelinquency', displayName: 'Collections Delinquency', description: '', active: false },
					{ name: 'DcmsDispute', displayName: 'Collections Dispute', description: '', active: false },
					{ name: 'DcmsDunning', displayName: 'Collections Dunning', description: '', active: false },
					{ name: 'DcmsLeasingContract', displayName: 'Collections Leasing Contract', description: '', active: false },
					{ name: 'DcmsLeasingInvoice', displayName: 'Collections Leasing Invoice', description: '', active: false },
					{ name: 'DcmsLitigation', displayName: 'Collections Litigation', description: '', active: false },
					{ name: 'DcmsPayment', displayName: 'Collections Payment', description: '', active: false },
					{ name: 'DcmsPaymentReversal', displayName: 'Collections Payment Reversal', description: '', active: false },
					{ name: 'DcmsPromiseToPay', displayName: 'Collections Promise to Pay', description: '', active: false },
					{ name: 'DcmsRepossession', displayName: 'Collections Repossession', description: '', active: false },
					{ name: 'DcmsWriteoff', displayName: 'Collections Writeoff', description: '', active: false },
				],
			},
		};
		return setup;
	}])
	
	.factory('serviceRegistry', ['$q', '$window', 'setup', 'tokenService', function($q, $window, setup, tokenService) {
		var getUriForName = function(name) {
			var list = setup.oauthProviders;
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
							tokenService.refreshToken(baseUri, tokens.refresh_token)
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
						tokenService
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
	
	.factory('errHandler', ['$mdToast', function($mdToast) {
		var errHandler = function(errMsg) { 
			$mdToast.show($mdToast.simple().content('[' + errMsg.status + '] ' + errMsg.statusText)); 
			console.error(JSON.stringify(errMsg));
			var err = new Error();
			console.error('Stacktrace', err.stack);
		};
		
		return errHandler;
	}])	
	
	/******************************************************************************************************************
	ATLAS SERVICES CLIENTS ********************************************************************************************
	*******************************************************************************************************************/
	.factory('tokenService', ['$q', '$resource', function($q, $resource) {
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
	
	
	.factory('serviceUtil', ['$q', '$resource', 'serviceRegistry', function($q, $resource, serviceRegistry) {
		var decorateActions = function(info, actions) {
			var result = {};
			if (actions) {
				for (var prop in actions) {
					result[prop] = info.action(actions[prop]);
				}
			}
			return result;
		};
		var getResource = function(serviceConfig, resourceUri, paramDefaults, actions) {
			var deferred = $q.defer();
			serviceRegistry.getServiceInfo(serviceConfig).then(function(info) {
				var resource = $resource(info.baseUri + resourceUri, paramDefaults, decorateActions(info, actions));
				deferred.resolve(resource);
			}, function(err) {
				deferred.reject(err);
			});
			return deferred.promise;
		};
		return {
			getResource: getResource,
		};
	}])
	
	.factory('cmsService', ['setup', 'serviceUtil', function(setup, serviceUtil) {
		var serviceConfig = setup.services.cmsSrv;
		var getRepositoryResource = function() { 
			return serviceUtil.getResource(serviceConfig, 'repositories/:id', { id: '@id' }, {
				'query': { method:'GET' },
				'create': { method:'POST' },
				'update': { method:'PUT' },
				'delete': { method:'DELETE' },
			});
		};
		var getRepositoryTypeResource = function() {
			return serviceUtil.getResource(serviceConfig, 'repositories/:repoId/types/:objTypeId', { repoId: '@repoId', objTypeId: '@objTypeId' }, {
				'get': { method:'GET', params: { objTypeId: 0 } },
				'query': { method:'GET' },
				'create': { method:'POST' },
				'update': { method:'PUT' },
				'delete': { method:'DELETE' },
			});
		};
		var getRepositoryTypeChildrenResource = function() {
			return serviceUtil.getResource(serviceConfig, 'repositories/:repoId/typechildren/:objTypeId', { repoId: '@repoId', objTypeId: '@objTypeId' }, {
				'get': { method:'GET', params: { objTypeId: 0 } },
				'query': { method:'GET' },
				'create': { method:'POST' },
			});
		};
		var getRepositoryTypeDescendantResource = function() {
			return serviceUtil.getResource(serviceConfig, 'repositories/:repoId/typedescendants/:objTypeId', { repoId: '@repoId', objTypeId: '@objTypeId' }, {
				'get': { method:'GET', params: { objTypeId: 0 } },
				'query': { method:'GET' },
			});
		};
		
		var _getRepositoryByName = function(page, name, success, error) {
			theService.queryRepositories(page, function(list) {
				if (list && list.items) {
					var repository = null;
					for (var i = 0; i < list.items.length; i++) {
						if (list.items[i].Name == name) {
							repository = list.items[i];
							break;
						}
					}
					if (repository != null) {
						success(repository);
					}
					else if (list.page < list.numPages) {
						_getRepositoryByName(list.page + 1, name, success, error);
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
	}])
	
	.factory('dcmsRepository', ['setup', 'cmsService', function(setup, cmsService) {
		var cachedRepository = null,
			typeCache = null;
		var getRepository = function(success, error) {
			var repoName = setup.services.cmsSrv.dcmsRepository;
			if (cachedRepository && cachedRepository.Name == repoName) {
				success(cachedRepository);
			}
			else {
				cmsService.getRepositoryByName(repoName, function(repository) {
					cachedRepository = repository;
					typeCache = null;
					success(repository);
				}, error);
			}
		};
		/*
		{
			documentType: <type>,
				infoSnippetBaseType: <type>,
					predefinedInfoSnippetType: <type>,
						predefinedInfoSnippetTypes: [<type>],
					customInfoSnippetType: <type>,
						customInfoSnippetTypes: [<type>],
			folderType: <type>,
		}
		*/
		var getRegistry = function(success, error) {
			if (typeCache) {
				success(typeCache);
			}
			else {
				getRepository(function(repository) {
					var params = { 
						repoId: repository.Id,
						depth: 4,
					};
					cmsService.getObjectTypes(params, function(objTypes) {
						typeCache = {};
						typeCache.repository = repository;
						// Cache all types
						typeCache.all = objTypes;
						// Cache base infoSnippetType
						typeCache.infoSnippetBaseType = null;
						for (var i=0; i<objTypes.length; i++) {
							objType = objTypes[i];
							if (objType.ParentId == 0 && objType.BaseId == 'Document')
								typeCache.documentType = objType;
							else if (objType.ParentId == 0 && objType.BaseId == 'Folder')
								typeCache.folderType = objType;
							else if (objType.Name == setup.services.cmsSrv.infoSnippetType.Name && objType.BaseId == 'Document')
								typeCache.infoSnippetBaseType = objType;
							else if (objType.Name == setup.services.cmsSrv.predefinedInfoSnippetType.Name && objType.BaseId == 'Document')
								typeCache.predefinedInfoSnippetType = objType;
							else if (objType.Name == setup.services.cmsSrv.customInfoSnippetType.Name && objType.BaseId == 'Document')
								typeCache.customInfoSnippetType = objType;
						};
						// Sanity checks
						if (typeCache.predefinedInfoSnippetType 
							&& typeCache.predefinedInfoSnippetType.ParentId != typeCache.infoSnippetBaseType.Id)
							typeCache.predefinedInfoSnippetType = null;
						if (typeCache.customInfoSnippetType 
							&& typeCache.customInfoSnippetType.ParentId != typeCache.infoSnippetBaseType.Id)
							typeCache.customInfoSnippetType = null;
						// Cache active infoSnippetTypes
						typeCache.predefinedInfoSnippetTypes = [];
						typeCache.customInfoSnippetTypes = [];
						for (var i=0; i<objTypes.length; i++) {
							objType = objTypes[i];
							if (typeCache.predefinedInfoSnippetType && objType.ParentId == typeCache.predefinedInfoSnippetType.Id)
								typeCache.predefinedInfoSnippetTypes.push(objType);
							else if (typeCache.customInfoSnippetType && objType.ParentId == typeCache.customInfoSnippetType.Id)
								typeCache.customInfoSnippetTypes.push(objType);
						};
						// Finish building cache
						success(typeCache);
					}, error);
				}, error);
			}
		};
		var getOrCreateBaseInfoSnippetType = function(success, error) {
			getRegistry(function(registry) {
				if (registry.infoSnippetBaseType) {
					success(registry.infoSnippetBaseType);
				}
				else {
					if (registry.documentType) {
						var params = {
							repoId: registry.repository.Id, 
							parentId: registry.documentType.Id, 
							typeData: setup.services.cmsSrv.infoSnippetType
						};
						cmsService.createObjectType(params, function(objType) {
							registry.infoSnippetBaseType = objType;
							success(objType);
						}, error);
					}
					else {
						error('Repository is not initialized for DCMS.');
					}
				}
			}, error);
		};
		var createInfoSnippetSubtype = function(registryTypeName, typeData, success, error) {
			getRegistry(function(registry) {
				if (registry[registryTypeName]) {
					error('dcmsRepository.createInfoSnippetSubtype: The subtype [' + registryTypeName + '] is already created.');
				}
				else {
					getOrCreateBaseInfoSnippetType(function(baseType) {
						var params = {
							repoId: registry.repository.Id, 
							parentId: baseType.Id, 
							typeData: typeData
						};
						cmsService.createObjectType(params, function(objType) {
							registry[registryTypeName] = objType;
							success(objType);
						}, error);
					}, error);
				}
			}, error);
		};
		var updateInfoSnippetSubtype = function(registryTypeName, typeData, success, error) {
			getRegistry(function(registry) {
				if (!registry[registryTypeName]) {
					error('dcmsRepository.updateInfoSnippetBaseType: The subtype [' + registryTypeName + '] is not created.');
				}
				else {
					var params = {
						repoId: registry.repository.Id, 
						objectTypeId: registry[registryTypeName].Id,
						typeData: typeData
					};
					cmsService.updateObjectType(params, function(objType) {
						registry[registryTypeName] = objType;
						success(objType);
					}, error);
				}
			}, error);
		};
		
		var theService = {
			getInfoSnippetType: function(success, error) {
				getRegistry(function(registry) {
					success(registry.infoSnippetBaseType);
				}, error);
			},
			getPredefinedInfoSnippetType: function(success, error) {
				getRegistry(function(registry) {
					success(registry.predefinedInfoSnippetType);
				}, error);
			},
			createPredefinedInfoSnippetBaseType: function(success, error) {
				createInfoSnippetSubtype('predefinedInfoSnippetType', setup.services.cmsSrv.predefinedInfoSnippetType, success, error);
			},
			updatePredefinedInfoSnippetBaseType: function(success, error) {
				updateInfoSnippetSubtype('predefinedInfoSnippetType', setup.services.cmsSrv.predefinedInfoSnippetType, success, error);
			},
			getCustomInfoSnippetType: function(success, error) {
				getRegistry(function(registry) {
					success(registry.customInfoSnippetType);
				}, error);
			},
			createCustomInfoSnippetBaseType: function(success, error) {
				createInfoSnippetSubtype('customInfoSnippetType', setup.services.cmsSrv.customInfoSnippetType, success, error);
			},
			updateCustomInfoSnippetBaseType: function(success, error) {
				updateInfoSnippetSubtype('customInfoSnippetType', setup.services.cmsSrv.customInfoSnippetType, success, error);
			},
			getPredefinedInfoSnippetTypes: function(success, error) {
				getRegistry(function(registry) {
					success(registry.infoSnippetTypes);
				}, error);
			},
			
		};
		return theService;
	}])
	
	.factory('orgModelService', ['setup', 'serviceUtil', function(setup, serviceUtil) {
		var serviceConfig = angular.copy(setup.services.omSrv);
		var getUserResource = function() { 
			return serviceUtil.getResource(serviceConfig, 'users/:id', { id: '@id' }, {
				'query': { method:'GET' },
				'create': { method:'POST' },
				'update': { method:'PUT' },
				'delete': { method:'DELETE' },
			});
		};
		var getGroupResource = function() { 
			return serviceUtil.getResource(serviceConfig, 'groups/:id', { id: '@id' }, {
				'query': { method:'GET' },
				'create': { method:'POST' },
			});
		};
		var getGroupUsersResource = function(groupId) { 
			return serviceUtil.getResource(serviceConfig, 'groups/:groupId/users/:userId', { groupId: groupId, userId: '@userId' }, {
				'query': { method:'GET', isArray:true },
				'append': { method:'PUT' },
				'remove': { method:'DELETE' },
			});
		};
		var getUnitResource = function() { 
			return serviceUtil.getResource(serviceConfig, 'units/:id', { id: '@id' }, {
				'query': { method:'GET', isArray:true },
				'create': { method:'POST' },
				'update': { method:'PUT' },
			});
		};
		var getUnitChildrenResource = function() { 
			return serviceUtil.getResource(serviceConfig, 'units/:id/children', { id: '@id' }, {
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
	}])
	
	/******************************************************************************************************************
	DIRECTIVES ********************************************************************************************************
	*******************************************************************************************************************/
	
	
	/******************************************************************************************************************
	CONTROLLERS *******************************************************************************************************
	*******************************************************************************************************************/
	.controller('DcmsController', ['$scope', function ($scope) {
	}])
	.controller('DcmsWorkspaceInboxController', ['$scope', '$stateParams', function ($scope, $stateParams) {
		$scope.wq = $stateParams.wq || 'my';
	}])
	
	
	.controller('DcmsSetupAuthenticationController', ['$scope', '$state', 'setup', function ($scope, $state, setup) {
		$scope.oauthProviders = setup.oauthProviders;
		
		$scope.gotoMain = function() {
			$state.go('dcms.setup.authentication');
		};
		$scope.saveNewOauthProvider = function(newOauthProvider) {
			setup.oauthProviders.push(newOauthProvider);
			$state.go('dcms.setup.authentication');
		};
		$scope.testOauthProvider = function(provider) {
			if (provider) {
				$state.go('dcms.setup.authentication.testOauthProvider', { providerName: provider.name });
			}
		};
		
	}])
	.controller('DcmsSetupAuthenticationTestOauthProviderController', ['$scope', '$stateParams', 'setup', 'tokenService', function ($scope, $stateParams, setup, tokenService) {
		var findProviderByName = function(providerName) {
			var foundProvider = null;
			angular.forEach(setup.oauthProviders, function(provider) { 
				if (provider.name == providerName) {
					foundProvider = provider;
				}
			});
			return foundProvider;
		};
		
		var provider = findProviderByName($stateParams.providerName);
		$scope.provider = provider;
		$scope.credentials = angular.copy(provider.credentials);
		$scope.getToken = function(provider, credentials) {
			if (provider && credentials && credentials.username && credentials.password) {
				tokenService.createToken(provider.uri, credentials).then(function(response) {
					$scope.result = response;
				});
			}
		};
		$scope.deleteToken = function(provider, refreshToken) {
			if (provider && refreshToken) {
				tokenService.deleteToken(provider.uri, refreshToken).then(function(response) {
					$scope.result = response;
				});
			}
		};
	}])
	
	.controller('DcmsSetupOmOrganizationController', ['$scope', '$filter', '$mdToast', 'setup', 'orgModelService', 'errHandler', function ($scope, $filter, $mdToast, setup, orgModelService, errHandler) {
		var getLocationRootUnit = function(callback) {
			orgModelService.queryUnits(function(units) {
				var units = $filter('filter')(units, { Name: setup.locations.rootUnitName }, true);
				var locationsRoot = null;
				if (units.length == 0) {
					$mdToast.show($mdToast.simple().content('Creating root unit for locations...'));
					var unit = { Name: setup.locations.rootUnitName };
					orgModelService.createUnit(unit, function(rootUnit) {
						$mdToast.show($mdToast.simple().content('Root unit for locations created succesfully.'));
						callback(rootUnit);
					}, errHandler);
				}
				else {
					locationsRoot = units[0];
					$mdToast.show($mdToast.simple().content('Root unit for locations found: ' + locationsRoot.Name));
					callback(locationsRoot);
				}
			}, errHandler);
		}
		
		$scope.service = setup.services.omSrv;
		$scope.oauthProviders = setup.oauthProviders;
		$scope.locations = [];
		
		$scope.testConnection = function() {
			orgModelService.queryUsers(function(result) {
				$mdToast.show($mdToast.simple().content('Connection is OK'));
			}, errHandler);			
		};
		
		var initLocations = true;
		var locationsRootUnit = null;
		$scope.onSelectLocations = function() {
			if (initLocations) {
				initLocations = false;
				getLocationRootUnit(function(rootUnit) {
					locationsRootUnit = rootUnit;
					orgModelService.queryUnitChildren(rootUnit.Id, function(locations) {
						$scope.locations = locations;
					}, errHandler);
				});
			};
		};
		
		$scope.beginEdit = function(location) {
			if (location) {
				$scope.viewLocation = {
					Id: location.Id, 
					Name: location.Name, 
					Properties: location.Properties || {}
				};
			}
			else {
				$scope.viewLocation = { Name: 'new' };
			}
		};
		$scope.cancelEdit = function() {
			$scope.viewLocation = null;
		};
		
		$scope.saveLocation = function(location) {
			if (locationsRootUnit) {
				if (location && location.Name) {
					var locationId = location.Id;
					if (locationId) {
						orgModelService.updateUnit(location, function(unit) {
							$mdToast.show($mdToast.simple().content('Location updated successfully.'));
							angular.forEach($scope.locations, function(value, key) {
								if (value.Id == unit.Id) {
									this[key] = value;
								}
							}, $scope.locations);
							$scope.viewLocation = null;
						}, errHandler);
					}
					else {
						orgModelService.createUnit(location, function(unit) {
							$mdToast.show($mdToast.simple().content('Location added successfully.'));
							$scope.locations.push(unit);
							$scope.viewLocation = null;
						}, errHandler);
					}
				}
			}
			else {
				window.alert('Should not happen: locationsRootUnit = null');
			}
		};

	}])
	
	.controller('DcmsSetupOmUsersController', ['$scope', '$mdToast', 'setup', 'orgModelService', 'errHandler', function ($scope, $mdToast, setup, orgModelService, errHandler) {
		var dcmsUsersGroup = null;
		
		$scope.users = [];
		$scope.beginEditUser = function(user) {
			if (user) {
				$scope.viewUser = {
					Id: user.Id,
					Username: user.Username,
					Firstname: user.Firstname,
					Lastname: user.Lastname,
					Email: user.Email,
				};
			}
			else {
				$scope.viewUser = { Username: 'newUser' };
			}
		};
		$scope.cancelEdit = function() {
			$scope.viewUser = null;
		};
		$scope.saveUser = function(userData) {
			if (userData && userData.Username) {
				if (userData.Id) {
					orgModelService.updateUser(userData, function(user) {
						$mdToast.show($mdToast.simple().content('User updated successfully.'));
						angular.forEach($scope.users, function(value, key) {
							if (value.Id == user.Id) {
								this[key] = value;
							}
						}, $scope.users);
						$scope.viewUser = null;
					}, errHandler);
				}
				else {
					orgModelService.createUser(userData, function(user) {
						orgModelService.appendGroupMembers(dcmsUsersGroup.Id, user.Id, function() {
							$mdToast.show($mdToast.simple().content('User added successfully.'));
							$scope.users.push(userData);
							$scope.viewUser = null;
						}, errHandler);
					}, errHandler);
				}
			}
		};
		
		orgModelService.getOrCreateGroupByName(setup.groups.dcmsUsers, null, function(group) {
			dcmsUsersGroup = group;
			orgModelService.queryGroupMembers(group.Id, function(users) {
				$scope.users = users;
			}, errHandler);
		}, errHandler);
	}])
	
	.controller('DcmsSetupOmMembershipController', ['$scope', '$q', 'setup', 'orgModelService', 'errHandler', function($scope, $q, setup, orgModelService, errHandler) {
		$scope.permissionSets = setup.permissions.sets;
		$scope.selectedUser = null;
		$scope.permissionFromDate = new Date();
		
		$scope.queryUsers = function(text) {
			if (!text || text.length < 2) {
				return [];
			}
			if ($scope.selectedUser && $scope.selectedUser.Username == text) {
				return [$scope.selectedUser];
			}
			deferred = $q.defer();
			orgModelService.queryUsers(text, function(result) {
				deferred.resolve(result.Items);
			}, errHandler);
			return deferred.promise;
		};
		
		$scope.assignPermissions = function(permissionSet) {
		};
	}])

	.controller('DcmsSetupRepositoryController', ['$scope', '$mdToast', '$mdDialog', 'setup', 'cmsService', 'errHandler', function($scope, $mdToast, $mdDialog, setup, cmsService, errHandler) {
		var showAlert = function(title, text, ev) {
			$mdDialog.show(
				$mdDialog.alert()
					//.parent(angular.element(document.body))
					.title(title)
					.content(text)
					.ariaLabel(title)
					.ok('Close')
					.targetEvent(ev)
			);
		};
		var handleRepositoryResponse = function(repository) {
			if (repository) {
				showAlert(repository.Name, 'id: ' + repository.Id 
					+ ', RootFolderId: ' + repository.RootFolderId 
					+ ', Description: ' + (repository.Description || '-')
				);
			}
			else {
				showAlert(name, 'Repository not found!');
			}
		};

		$scope.serviceConfig = setup.services.cmsSrv;
		$scope.oauthProviders = setup.oauthProviders;

		$scope.testConnection = function() {
			cmsService.queryRepositories(function(result) {
				$mdToast.show($mdToast.simple().content('Connection is OK'));
			}, errHandler);	
		};
		$scope.showRepository = function(name) {
			cmsService.getRepositoryByName(name, handleRepositoryResponse, errHandler);	
		};
		$scope.createRepository = function(name) {
			if (name) {
				cmsService.getRepositoryByName(name, function(repository) {
					if (repository == null) 
						cmsService.createRepository({ Name: name}, handleRepositoryResponse, errHandler);
					else
						showAlert(name, 'Repository already exists!');
				}, errHandler);	
			}
		};
	}])
	
	.controller('DcmsSetupInfoSnippetsController', ['$scope', 'setup', 'errHandler', 'dcmsRepository', function($scope, setup, errHandler, dcmsRepository) {

		dcmsRepository.getPredefinedInfoSnippetType(function(objType) {
			$scope.predefinedBaseType = objType;
			if (objType) {
				$scope.usePredefinedSnippets = objType.IsCreatable;
				dcmsRepository.getPredefinedInfoSnippetTypes(function(activeTypes) {
					// Update active flags if found
					var allTypes = setup.infoSnippets.types;
					if (activeTypes && activeTypes.length) {
						for (var i=0; i<allTypes.length; i++) {
							var targetType = allTypes[i];
							for (var j=0; j<activeTypes.length; j++)
								if (activeTypes[j].Name == targetType.name)
									targetType.active = true;
						}
					}
					$scope.types = allTypes;
				}, errHandler);
			}
		}, errHandler);

		$scope.togglePredefinedSnippets = function() {
			$scope.predefinedBaseType.IsCreatable = !($scope.predefinedBaseType.IsCreatable);
			// #TODO: Update document type
			console.warn('#TODO: Update document type');
		};

		$scope.viewPredefinedBaseType = function() {
		};
		
		$scope.createPredefinedBaseType = function() {
			dcmsRepository.createPredefinedInfoSnippetBaseType(function(objType) {
				$scope.predefinedBaseType = objType;
			}, errHandler);
		};
		$scope.updatePredefinedBaseType = function() {
			dcmsRepository.updatePredefinedInfoSnippetBaseType(function(objType) {
				$scope.predefinedBaseType = objType;
			}, errHandler);
		};

		$scope.togglePredefinedType = function(type) {
			if (type.active) {
				alert("Create " + JSON.stringify(type));
			}
			else {
				alert("Delete " + type.name);
			}
		};
	}])