angular.module('dcw', [
		'ui.router', 
	])
	
	.config(['$stateProvider', '$urlRouterProvider', '$mdIconProvider', function ($stateProvider, $urlRouterProvider, $mdIconProvider) {
		$mdIconProvider
			.iconSet('social', '/assets/img/social-icons.svg', 24)
			.iconSet('device', '/assets/img/device-icons.svg', 24)
			.iconSet('communication', '/assets/img/communication-icons.svg', 24)
			.defaultIconSet('/assets/img/core-icons.svg', 24);
			
		$urlRouterProvider
			.when("/dcw", "/dcw/home");
		
		$stateProvider
			.state('dcw', {
				abstract: true,
				url: '/dcw',
				templateUrl: '/components/dcw/dcw.html',
				controller: 'DcwController',
			})
			.state('dcw.home', { url: '/home', templateUrl: '/components/dcw/home.html', })
		;
	}])
	
	/******************************************************************************************************************
	APP RUN ***********************************************************************************************************
	*******************************************************************************************************************/
	//.run(['$rootScope', function ($rootScope) {
	//	$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
	//	});
	//}])
	
	/******************************************************************************************************************
	SERVICES/FACTORIES ************************************************************************************************
	*******************************************************************************************************************/
	//.factory('service', [function() {
	//	return service;
	//}])
	
	/******************************************************************************************************************
	DIRECTIVES ********************************************************************************************************
	*******************************************************************************************************************/
	
	
	/******************************************************************************************************************
	CONTROLLERS *******************************************************************************************************
	*******************************************************************************************************************/
	.controller('DcwController', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {
		$scope.toggleSidenav = function(id)  {
			$mdSidenav(id).toggle().then(function(){
			});
		};
		$scope.openSidenav = function(id)  {
			$mdSidenav(id).open().then(function(){
			});
		};
		$scope.closeSidenav = function(id)  {
			$mdSidenav(id).close().then(function(){
			});
		};
		$scope.isSidenavOpen = function(id)  {
			return $mdSidenav(id).isOpen();
		};
		$scope.isSidenavLockedOpen = function(id)  {
			return $mdSidenav(id).isLockedOpen();
		};
	}])
	;