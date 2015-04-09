angular.module('dcms', [
		'ui.router', 
		'ngMaterial',
		'ngMessages',
	])
	.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
		//$mdThemingProvider.theme('altTheme')
		//	.primaryPalette('blue')
		//	.accentPalette('indigo')
		//	.warnPalette('red')
		//	.backgroundPalette('grey');
		//$mdThemingProvider.setDefaultTheme('altTheme');
		
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
			.state('dcms.setup.omGroups', { url: '/omGroups', templateUrl: '/components/dcms/setup.omGroups.html', })
			.state('dcms.setup.omMembership', { url: '/omMembership', templateUrl: '/components/dcms/setup.omMembership.html', })
			.state('dcms.setup.omCollectors', { url: '/omCollectors', templateUrl: '/components/dcms/setup.omCollectors.html', })
			.state('dcms.setup.omSecurity', { url: '/omSecurity', templateUrl: '/components/dcms/setup.omSecurity.html', })
			.state('dcms.setup.domReceivables', { url: '/domReceivables', templateUrl: '/components/dcms/setup.domReceivables.html', })
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
				default1: {
					access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiJlOTM2NmEzZS1lZDU5LTQ2NWItYWM1Ny0wMjUzNGYyMjFlMDciLCJ1bmlxdWVfbmFtZSI6IkpvaG5Eb2UiLCJpc3MiOiJhdGxhcy5pZCIsImV4cCI6MTQyODU4MTY5MSwibmJmIjoxNDI4NTc4MDkxfQ.ww6rMraRrp-VU2zycK72j9GppROJnZIWJWj5Wubs5Us",
refresh_token: "g50hHPzCYHNIprZwLrnB5w5t-PVRdGk-F8FFATYVNdY"
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
			$mdToast.show($mdToast.simple().content(errMsg)); 
			console.error(errMsg);
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
	
	.factory('orgModelService', ['$q', '$resource', 'setup', 'serviceUtil', function($q, $resource, setup, serviceUtil) {
		var serviceConfig = angular.copy(setup.services.omSrv);
		var getUserResource = function() { 
			return serviceUtil.getResource(serviceConfig, 'users/:id', { id: '@id' }, {
				'query': { method:'GET' },
				'create': { method:'POST' },
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
				'query': { method:'GET' },
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
			queryUsers: function(success, error) {
				getUserResource().then(function(theResource) {
					theResource.query(success, error);
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
					payload.$update({ id: resourceId }).then(success, error);
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
			appendGroupMembers: function(groupId, userId, success, error) {
				getGroupUsersResource(groupId).then(function(theResource) {
					var payload = new theResource(userId);
					payload.$append().then(success, error);
				}, error);
			},
			removeGroupMembers: function(groupId, userId, success, error) {
				getGroupUsersResource(groupId).then(function(theResource) {
					var payload = new theResource(userId);
					payload.$remove().then(success, error);
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
							$scope.locations.push(unit);
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
		$scope.users = [];
		$scope.beginEditUser = function(user) {
			if (user) {
				$scope.viewUser = {
					Id: user.Id,
					Username: user.Username,
					Firstname: user.Firstname,
					Lastname: user.Lastname,
					Email: user.Email,
					Properties: user.Properties,
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
				}
				else {
					orgModelService.getOrCreateGroupByName(setup.groups.dcmsUsers, null, function(group) {
					orgModelService.createUser(userData, function(user) {
					orgModelService.appendGroupMembers(group.Id, user.Id, function() {
						$mdToast.show($mdToast.simple().content('User added successfully.'));
						$scope.users.push(userData);
						$scope.viewUser = null;
					}, errHandler);
					}, errHandler);
					}, errHandler);
				}
			}
		};
	}])