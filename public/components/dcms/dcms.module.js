﻿angular.module('dcms', [
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
			cachedTokens: {
				default: {
					"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiJlOTM2NmEzZS1lZDU5LTQ2NWItYWM1Ny0wMjUzNGYyMjFlMDciLCJ1bmlxdWVfbmFtZSI6IkpvaG5Eb2UiLCJpc3MiOiJhdGxhcy5pZCIsImV4cCI6MTQyOTE5ODY3NSwibmJmIjoxNDI5MTk1MDc1fQ.FH5dOIE1kS5-siVlPNDY29EH00Js85oSPFLv8uGM6To",
  "refresh_token": "JHm2UClYVH7IYQaFvJVN9T7AzikZE68WMmuzHGAXUuE"
				},
			},
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
					{ code: 'DcmsAccount', name: 'Collections Account', description: '', active: false },
					{ code: 'DcmsAdjustment', name: 'Collections Adjustment', description: '', active: false },
					{ code: 'DcmsBankruptcy', name: 'Collections Bankruptcy', description: '', active: false },
					{ code: 'DcmsBillTo', name: 'Collections Bill To', description: '', active: false },
					{ code: 'DcmsCases', name: 'Collections Cases', description: '', active: false },
					{ code: 'DcmsDelinquency', name: 'Collections Delinquency', description: '', active: false },
					{ code: 'DcmsDispute', name: 'Collections Dispute', description: '', active: false },
					{ code: 'DcmsDunning', name: 'Collections Dunning', description: '', active: false },
					{ code: 'DcmsLeasingContract', name: 'Collections Leasing Contract', description: '', active: false },
					{ code: 'DcmsLeasingInvoice', name: 'Collections Leasing Invoice', description: '', active: false },
					{ code: 'DcmsLitigation', name: 'Collections Litigation', description: '', active: false },
					{ code: 'DcmsPayment', name: 'Collections Payment', description: '', active: false },
					{ code: 'DcmsPaymentReversal', name: 'Collections Payment Reversal', description: '', active: false },
					{ code: 'DcmsPromiseToPay', name: 'Collections Promise to Pay', description: '', active: false },
					{ code: 'DcmsRepossession', name: 'Collections Repossession', description: '', active: false },
					{ code: 'DcmsWriteoff', name: 'Collections Writeoff', description: '', active: false },
				],
			},
		};
		return setup;
	}])
	
	.factory('serviceRegistry', ['$q', 'setup', 'tokenService', function($q, setup, tokenService) {
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
				console.warn('Failed with ' + rejection.status + ' status');
				if (rejection.status == 401) {
				}
				return $q.reject(rejection);
			}
		};
		var cache = setup.cachedTokens;
		var getCachedTokens = function(name) {
			return cache[name];
		};
		var setCachedTokens = function(name, tokens) {
			cache[name] = tokens;
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
								setCachedTokens(providerName, tokens)
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
	/*
	.factory('http', ['$http', 'tokenService', function($http, tokenService) {
		var cachedTokens = {};
		var concat = function(baseUri, resourceUri) {
			return baseUri + resourceUri;
		};
		var decorate = function(serviceConfig, resourceUri, method, data, userConfig) {
			var url = concat(serviceConfig.uri, resourceUri);
			var config = {
				method: method,
				url: url,
			};
			if (data) {
				config.data = config;
			}
			if (serviceConfig.securityType == 'oauth2') { 
				var providerName = serviceConfig.oauth2.providerName;
				var tokens = cachedTokens[providerName];
				if (tokens) {
					config.headers = { Authorization: "Bearer " + tokens.access_token };
					return $http(angular.extend(userConfig || {}, config));
				}
				else {
					var deferred = $q.defer();
					var baseUri = getUriForName(providerName);
					if (baseUri == null)
						deferred.reject('No URI for provider ' + providerName);
					tokenService
						.createToken(baseUri, { username: 'JohnDoe', password: 'JohnDoe'})
						.then(function(tokens) {
							cachedTokens[providerName] = tokens;
							config.headers = { Authorization: "Bearer " + tokens.access_token; };
							deferred.resolve($http(angular.extend(userConfig || {}, config)));
						}, function(err) {
							deferred.reject(err);
						});
					return deferred.promise;
				}
			}
			else {
				return $http(angular.extend(userConfig || {}, config));
			}
		};
		return {
			get: function(serviceConfig, uri, config) { 
				return decorate(serviceConfig, uri, 'GET', null, config);
			},
			post: function(serviceConfig, uri, data, config) { 
				return decorate(serviceConfig, uri, 'POST', data, config);
			},
			put: function(serviceConfig, uri, data, config) { 
				return decorate(serviceConfig, uri, 'PUT', data, config);
			},
			delete: function(serviceConfig, uri, config) { 
				return decorate(serviceConfig, uri, 'DELETE', null, config);
			},
		};
	}])
	*/
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
	
	.controller('DcmsSetupInfoSnippetsController', ['$scope', 'setup', function($scope, setup) {
		$scope.serviceConfig = setup.services.omSrv;
		$scope.oauthProviders = setup.oauthProviders;
	
		$scope.types = setup.infoSnippets.types;
		$scope.showSnippetType = function(type) {
			alert(JSON.stringify(type));
		};
	}])