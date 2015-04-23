angular.module('dcms.workspace', [
		'ui.router', 
		'ngMaterial',
		'ngMessages',
		'atlas.client',
	])
	
	/******************************************************************************************************************
	APP CONFIG ********************************************************************************************************
	*******************************************************************************************************************/
	.config(['$stateProvider', '$urlRouterProvider', '$mdIconProvider', function ($stateProvider, $urlRouterProvider, $mdIconProvider) {
		var baseTemplateUrl = '/components/dcms/workspace/';
		
		$mdIconProvider
			//.iconSet('communication', '/assets/img/communication-icons.svg', 24)
			.defaultIconSet('/assets/img/core-icons.svg', 24);
		
		$urlRouterProvider
			.when("/dcms/workspace", "/dcms/workspace/inbox/")
			.when("/dcms/workspace/", "/dcms/workspace/inbox/")
			.when("/dcms/workspace/inbox", "/dcms/workspace/inbox/")
			;
			
		$stateProvider
			.state('dcms.workspace', { url: '/workspace', templateUrl: baseTemplateUrl + 'index.html', })
			.state('dcms.workspace.inbox', { 
				url: '/inbox/:wq', 
				templateUrl: baseTemplateUrl + 'inbox.html',
				controller: 'DcmsWorkspaceInboxController',				
			})
			.state('dcms.workspace.inboxItem', { 
				url: '/inbox/:wq/:id', 
				templateUrl: baseTemplateUrl + 'inboxItem.html',
				controller: 'DcmsWorkspaceInboxItemController', 
			})
			.state('dcms.workspace.admin', { url: '/admin', templateUrl: baseTemplateUrl + 'admin.html', })
			.state('dcms.workspace.adminSettings', { url: '/admin/settings', templateUrl: baseTemplateUrl + 'adminSettings.html', })
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
	//.factory('serviceName', [function() {
	//}])
	
	/******************************************************************************************************************
	DIRECTIVES ********************************************************************************************************
	*******************************************************************************************************************/
	//.directive('directiveName', [function() {
	//}])
	/******************************************************************************************************************
	CONTROLLERS *******************************************************************************************************
	*******************************************************************************************************************/
	.controller('DcmsWorkspaceInboxController', ['$scope', '$stateParams', function ($scope, $stateParams) {
		var initialSpaceCode = $stateParams.wq || 'my';
		var availableSpaces = [
			{code: 'my', name: 'My tasks'}, 
			{code: 'q1', name: 'Delinquent customers'}, 
			{code: 'q2', name: 'Broken promises'}
		];
		var getWorklist = function(spaceCode) {
			var space = {code: null, name: ''};
			for (var i=0; i<availableSpaces.length; i++) {
				if (availableSpaces[i].code == spaceCode) {
					space = availableSpaces[i];
					break;
				}
			}
			
			return {
				space: space,
				levels: [
					{code:'L1', name:'customer'},
					{code:'L2', name:'account'},
					{code:'L3', name:'bill to'},
					{code:'L4', name:'item'},
				],
				items: [
					{ 
						customer: { id: 111 }, 
						account: null, 
						billTo: null, 
						data: { customer: 'J. A. Doe', score: 54, overdueAmount: 12521.12, info: '2109999999 / xxx@domain.com' },
						routes: { edit: '#/dcms/workspace/inbox/' + spaceCode + '/111' },
					},
					{ 
						customer: { id: 222 }, 
						account: null, 
						billTo: null, 
						data: { customer: 'Bill Hicks', score: 21, overdueAmount: 321.12, info: '2108888888 / bill@domain.com' },
						routes: { edit: '#/dcms/workspace/inbox/' + spaceCode + '/222' },
					},
				]
			};
		};
		
		var vm = {
			availableSpaces: availableSpaces,
			worklist: getWorklist(initialSpaceCode),
			changeWorklist: function(code) {
				this.worklist = getWorklist(code)
			}
		};
		
		$scope.vm = vm;
	}])
	
	.controller('DcmsWorkspaceInboxItemController', ['$scope', '$stateParams', function ($scope, $stateParams) {
		var workqueue = $stateParams.wq || 'my'; 
		var workItemId = $stateParams.id; 
		var customer = {
			firstName: 'John',
			lastName: 'Doe',
			middleName: '',
		};
		var vm = {
			title: customer.firstName + ' ' + customer.lastName,
			backUrl: '#/dcms/workspace/inbox/' + workqueue,
			customer: customer,
		};
		$scope.vm = vm;

	}])