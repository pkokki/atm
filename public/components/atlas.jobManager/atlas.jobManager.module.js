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
			{ name: 'noopJob', priority: 5, }
		];
		var config = function(jobTemplates) {
			jobTemplates = jobTemplates;
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
			var jobTypes = [
				{ id: 'noop', name: 'noop job', priority: 10, waitfor: [], startDate: null,  },
			];
			var jobs = {
				pending: [],
				running: [],
				completed: [],
				inactive: []
			};
			var theService = {
				getAvailableJobTypes: function(success, error) {
					success(jobTypes);
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
				createJob: function(jobTypeName, data, success, error) {
					var job = angular.extend({ id: jobId++ }, data);
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