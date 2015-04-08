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
			.state('dcms.setup.omUsers', { url: '/omUsers', templateUrl: '/components/dcms/setup.omUsers.html', })
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
		var cache = {};
		var getCachedTokens = function(name) {
			return cache[name];
		};
		var setCachedTokens = function(name, tokens) {
			cache[name] = tokens;
		};
		
		return {
			getServiceInfo: function(serviceConfig) {
				var deferred = $q.defer();
				var info = { baseUri: serviceConfig.uri, headers: {} };
				if (serviceConfig.securityType == 'oauth2') { 
					var providerName = serviceConfig.oauth2.providerName;
					var tokens = getCachedTokens(providerName);
					if (tokens) {
						info.headers.Authorization = "Bearer " + tokens.access_token;
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
								info.headers.Authorization = "Bearer " + tokens.access_token;
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
	
	.factory('orgModelService', ['$q', '$resource', 'setup', 'serviceRegistry', function($q, $resource, setup, serviceRegistry) {
		var serviceConfig = angular.copy(setup.services.omSrv);
		return {
			getConfig: function() {
				return serviceConfig;
			},
			getUserResource: function() {
				var deferred = $q.defer();
				serviceRegistry.getServiceInfo(serviceConfig).then(function(info) {
					var resource = $resource(info.baseUri + 'users', null, {
						'query': { method:'GET', headers: info.headers },
					});
					deferred.resolve(resource);
				}, function(err) {
					deferred.reject(err);
				});
				return deferred.promise;
			},
			groups: null,
			units: null,
			roles: null,
			permissions: null,
		};
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
	
	.controller('DcmsSetupOmOrganizationController', ['$scope', '$mdToast', 'setup', 'orgModelService', function ($scope, $mdToast, setup, orgModelService) {
		$scope.service = setup.services.omSrv;
		$scope.oauthProviders = setup.oauthProviders;
		
		$scope.testConnection = function() {
			orgModelService.getUserResource().then(function(userRs) {
				if (userRs == null)
					window.alert('Should not happen: userRs = null');
				userRs.query(function(result) {
					$mdToast.show($mdToast.simple().content('Connection is OK'));
				}, function(result) {
					$mdToast.show($mdToast.simple().content('Error connecting to the service.'));
				});
			});
			
		};

	}])
	
	