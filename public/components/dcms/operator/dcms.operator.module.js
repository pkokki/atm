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
	.controller('DcmsOperatorController', ['$scope', 'jobManager', function ($scope, jobManager) {
		var vm = {
			availableJobs: jobManager.getAvailableJobs(),
			createJob: function(job) {
				jobManager.requestJob(job.name);
			},
		};
		$scope.vm = vm;
	}])