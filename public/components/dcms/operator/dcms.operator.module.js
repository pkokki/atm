angular.module('dcms.operator', [
		'ui.router', 
		'ngMaterial',
		'ngMessages',
		'atlas.client',
		'atlas.jobManager',
	])

	/******************************************************************************************************************
	APP CONFIG ********************************************************************************************************
	*******************************************************************************************************************/
	.config(['$stateProvider', '$urlRouterProvider', '$mdIconProvider', function ($stateProvider, $urlRouterProvider, $mdIconProvider) {
		var baseTemplateUrl = '/components/dcms/operator/';
		
		$mdIconProvider
			//.iconSet('communication', '/assets/img/communication-icons.svg', 24)
			.defaultIconSet('/assets/img/core-icons.svg', 24);
		
		//$urlRouterProvider
		//	.when("/dcms/operator", "/dcms/operator/inbox/")
		//	;
			
		$stateProvider
			.state('dcms.operator', { 
				url: '/operator', 
				templateUrl: baseTemplateUrl + 'index.html', 
				controller: 'DcmsOperatorController',
			})
		;
	}])
	
	/******************************************************************************************************************
	CONTROLLERS *******************************************************************************************************
	*******************************************************************************************************************/
	.controller('DcmsOperatorController', ['$scope', 'errHandler', 'jobManager', function ($scope, errHandler, jobManager) {
		var vm = {
			availableJobTypes: [],
			pendingJobs: [],
			createJob: function(jobType) {
				jobManager.createJob(jobType, {}, function(job) {
					vm.refreshPendingJobs(angular.noop);
				}, errHandler);
			},
			refreshPendingJobs: function() {
				jobManager.getPendingJobs(function(jobs) {
					vm.pendingJobs = jobs;
				}, errHandler);
			},
		};
		$scope.vm = vm;
		
		jobManager.getAvailableJobTypes(function(types) {
			vm.availableJobTypes = types;
		});
	}])