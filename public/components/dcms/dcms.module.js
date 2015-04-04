angular.module('dcms', [
		'ui.router', 
		'ngMaterial',
		'ngMessages',
	])
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
			.state('dcms.setup.omOrganization', { url: '/omOrganization', templateUrl: '/components/dcms/setup.omOrganization.html', })
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
	.factory('sys', [function() {
		var sys = {
			services: {
				om: {
					uri: 'http://atlas-orgmodel.azurewebsites.net/api/',
				},
			},
		};
		return sys;
	}])
	
	/******************************************************************************************************************
	CONTROLLERS *******************************************************************************************************
	*******************************************************************************************************************/
	.controller('DcmsController', ['$scope', function ($scope) {
	}])
	.controller('DcmsWorkspaceInboxController', ['$scope', '$stateParams', function ($scope, $stateParams) {
		$scope.wq = $stateParams.wq || 'my';
	}])
	