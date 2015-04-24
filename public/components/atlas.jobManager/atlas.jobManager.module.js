angular.module('atlas.jobManager', [
		'atlas.client',
	])
	/******************************************************************************************************************
	APP CONFIG ********************************************************************************************************
	*******************************************************************************************************************/
	//.config([function () {
	//}])
	/******************************************************************************************************************
	APP RUN ***********************************************************************************************************
	*******************************************************************************************************************/
	//.run(['$rootScope', function ($rootScope) {
	//}])
	/******************************************************************************************************************
	SERVICES **********************************************************************************************************
	*******************************************************************************************************************/
	.value('jobTaskSpecification', {
		name: 'DCMS_JOB',
		definition: {
			Name: 'DCMS_JOB',
			TaskType: 'Task',
			PotentialOwners: [{ Type: 'LiteralUser', LiteralEntityName: 'DCMS_OPERATOR'}],
			StakeHolders: [{ Type: 'LiteralUser', LiteralEntityName: 'DCMS_OPERATOR'}],
			BusinessAdministrators: [{ Type: 'LiteralUser', LiteralEntityName: 'DCMS_OPERATOR'}],
			PresentationElements: [{
				Language: 'en',
				TaskTitle: 'DCMS_JOB',
				TaskSubject: 'DCMS_JOB',
				TaskDescription: 'DCMS_JOB',
			}]
		}
	})
	.provider('jobManager', [function() {
		var mode = 'memory';
		var jobTemplates = [
			{ name: 'noopJob', description: 'no-op', priority: 9, waitfor: [], startDate: null, },
			{ name: 'Case Owner Load Balancing', },
			{ name: 'Create Dunning and Broken Promise Call Backs', notes: 'Display dunning callbacks in the Collector`s Work Queue' },
			{ name: 'Delinquency Status Determination', notes: 'Assigns a status of Current or Delinquent to transactions. If you are using Loans, it can also assign a status of Active or In Default.' },
			{ name: 'Delinquency Management', notes: '(a) Selects a strategy for each delinquent object. (b) Calculates the scores and assigns a status. It runs at the transaction level. (c) Updates the summary data based on the Collections level for that particular party.' },
			{ name: 'Notify Customer', },
			{ name: 'Notify Ext Agency', },
			{ name: 'Open Interfaces', },
			{ name: 'Populate UWQ Summary Table', notes: 'Populates information for the data level at which you run strategies. The program loops for each collections definition level specified on the Operation Setup task' },
			{ name: 'Process Pending', },
			{ name: 'Promise Reconciliation', },
			{ name: 'Purge Score History Table', notes: 'Purges historical data stored for scoring'},
			{ name: 'Recall Transfer', },
			{ name: 'Refresh Metrics Summary Table', notes: 'Refresh the metric values.' },
			{ name: 'Report All Contracts', },
			{ name: 'Review Transfer', },
			{ name: 'Scoring Engine Harness', notes: '(a) Requests a Transaction Scoring Engine to score invoices and then to create delinquencies, (b) requests a Party Scoring Engine and an Account Scoring Engine, (*) runs from one to five scoring engines' },
			{ name: 'Send Dunning for Delinquent Customers', notes: 'Creates dunning letters at one of the operational data levels' },
			{ name: 'Strategy Management', },
			{ name: 'Synchronize Territory Assignment Rules', notes: 'Creates territories defined in the territory setup and adda the customers to each territory. It must be run at least once before you assign resources and each time after you modify the territory setup.' },
			{ name: 'Territory Assignment', notes: 'Assigns collectors at the desired operational data level. This program retrieves a list of available collectors for each territory and assigns the first collector on the list.' },
			
		];
		var config = function(templates) {
			jobTemplates = templates;
		};
		
		var atlasFactory = ['taskServiceClient', 'jobTaskSpecification', function(taskServiceClient, jobTaskSpecification) {
			var requestJob = function(name, data, success, error) {
				taskServiceClient.getOrCreateTaskSpecification(jobTaskSpecification.name, jobTaskSpecification.definition, function(spec) {
					var jobCreationData = {
						SpecId: spec.Id,
						SpecName: spec.Name,
					};
					if (data)
						jobCreationData.Input = data;
					taskServiceClient.createTask(jobCreationData, function(task) {
						success(task);
					}, error);
				}, error);
			};
			var getAvailableJobs = function(success, error) {
				success(jobTemplates);
			};
		
			var theService = {
				getAvailableJobs: getAvailableJobs,
				requestJob: requestJob,
				getPendingJobs: function(success, error) {
					taskServiceClient.queryTaskSummaries({ Type: 'task', States: 'Reserved', WhereClauses: 'Name=DCMS_JOB' }, function(result) {
						success(result);
					}, error);
				}
			};
			return theService;
		}];
		
		var memoryFactory = [function() {
			var jobId = 0;
			var jobs = {
				pending: [],
				running: [],
				completed: [],
				inactive: []
			};
			var theService = {
				getAvailableJobTypes: function(success, error) {
					success(jobTemplates);
				},
				getPendingJobs: function(success, error) {
					success(jobs.pending);
				},
				getRunningJobs: function(success, error) {
					success(jobs.running);
				},
				getCompletedJobs: function(success, error) {
					success(jobs.completed);
				},
				getInactiveJobs: function(success, error) {
					success(jobs.inactive);
				},
				createJob: function(jobType, data, success, error) {
					var job = angular.extend({ id: jobId++ }, jobType, data);
					jobs.pending.push(job);
					success(job);
				},
				holdJob: function(id, success, error) {
				},
				cancelJob: function(id, success, error) {
				},
				terminateJob: function(id, success, error) {
				},
			};
			return theService;
		}];
		
		return {
			config: config,
			$get: (mode == 'memory' ? memoryFactory : atlasFactory),
		};
	}])