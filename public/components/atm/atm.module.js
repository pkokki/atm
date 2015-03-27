angular.module('app')
	.config(['$stateProvider', 'sidebarMenuProvider', function ($stateProvider, sidebarMenuProvider) {
		$stateProvider
			.state('atm', {
				url: '/atm',
				templateUrl: '/components/atm/atm.html',
				controller: 'AtmController',
				onEnter: function(sidebarMenu) { sidebarMenu.activate('atmHome'); },
				onExit: function(sidebarMenu) { sidebarMenu.deactivate('atmHome'); },
			})
		;
		
		var atmHomeItems = [
			//{ title: 'Loan overview', url: '#/lms/loan/:id' },
		];
		sidebarMenuProvider.registerMenuItems('atmHome', atmHomeItems);
	}])
	
	.controller('AtmController', ['$scope', function ($scope) {
		
	}])