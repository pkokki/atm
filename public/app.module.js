angular.module('app', [
		'ui.router', 
		'atm',
		'dcms',
		'dcw',
	])

	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');
		
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/components/index.html',
			})
		;
	}])
	
	;