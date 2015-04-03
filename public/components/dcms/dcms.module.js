angular.module('app')
	.config(['$stateProvider', '$urlRouterProvider', 'sidebarMenuProvider', function ($stateProvider, $urlRouterProvider, sidebarMenuProvider) {
		$urlRouterProvider.when("/dcms", "/dcms/home");
		
		$stateProvider
			.state('dcms', {
				abstract: true,
				url: '/dcms',
				templateUrl: '/components/dcms/dcms.html',
				/*controller: 'AtmController',*/
			})
			.state('dcms.home', {
				url: '/home',
				templateUrl: '/components/dcms/home.html',
				/*controller: 'AtmIntroController',*/
			})
		;
	}])
	
	