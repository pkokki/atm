angular.module('app', [
		'ui.router', 
		'ngResource', 
		'ngMaterial',
		'ngMessages'
	])
	
	.provider('sidebarMenu', function SidebarMenuProvider() {
		var menuItems = {};
		
		function SidebarMenu() {
			var callbacks = [],
				fireChange = function(items) {
					for (var i = 0; i < callbacks.length; i++) {
						callbacks[i](items);
					}
				};
			
			this.activate = function(key, value) {
				var items = menuItems[key];
				if (value) {
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						item.url = item.url.replace(':id', value);
					}
				}
				fireChange(items);
			}
			this.deactivate = function(key) {
				fireChange([]);
			}
			
			this.onchange = function(callback) {
				callbacks.push(callback);
			};
		}
		
		this.registerMenuItems = function(key, items) {
			menuItems[key] = items;
		}
		
		this.$get = [function sidebarMenuFactory() {
			return new SidebarMenu();
		}];
	})
	
	.controller('AppController', ['$scope', '$mdSidenav', '$mdMedia', '$mdBottomSheet', 'sidebarMenu', '$log', function($scope, $mdSidenav, $mdMedia, $mdBottomSheet, sidebarMenu, $log) {
		$scope.toggleSidebar = function() {
			$mdSidenav('left').toggle()
				.then(function(){
					$log.debug("toggle left is done");
				});
		};
		$scope.closeSidebar = function() {
			$mdSidenav('left').close()
				.then(function(){
					$log.debug("close LEFT is done");
				});
		};
		
		$scope.isSidebarLocked = function() {
			return $mdMedia('gt-md');
		}
		
		sidebarMenu.onchange(function(items) { $scope.sidebarItems = items; });
		
		$scope.showBottomSheet = function($event) {
			$mdBottomSheet.show({
				templateUrl: 'shared/bottomSheet.html',
				//controller: 'ListBottomSheetCtrl',
				targetEvent: $event
			}).then(function(clickedData) {
				$log.info('Bottom sheet clicked: ' + clickedData);
			});
		};
		$log.info('App started');
	}])
	.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');
		
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/components/index.html',
			})
		;
	}]);