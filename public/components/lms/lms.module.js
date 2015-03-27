angular.module('app')
	.config(['$stateProvider', 'sidebarMenuProvider', function ($stateProvider, sidebarMenuProvider) {
		$stateProvider
			.state('lmsHome', {
				url: '/lms',
				templateUrl: '/components/lms/home.html',
				controller: 'LmsHomeController',
				onEnter: function(sidebarMenu) { sidebarMenu.activate('lmsHome'); },
				onExit: function(sidebarMenu) { sidebarMenu.deactivate('lmsHome'); },
			})
			.state('lmsLoanNew', {
				url: '/lms/loan/new',
				templateUrl: '/components/lms/loan_new.html',
				controller: 'LmsLoanNewController',
			})
			.state('lmsLoanHome', {
				url: '/lms/loan/:id',
				templateUrl: '/components/lms/loan_main.html',
				controller: 'LmsLoanHomeController',
				onEnter: function(sidebarMenu, $stateParams) { sidebarMenu.activate('lmsLoanId', $stateParams.id); },
				onExit: function(sidebarMenu) { sidebarMenu.deactivate('lmsLoanId'); },
			})
			.state('lmsLoanPayments', {
				url: '/lms/loan/:id/payments',
				templateUrl: '/components/lms/loan_payments.html',
				controller: 'LmsLoanPaymentsController'
			})
			.state('lmsPaymentDetails', {
				url: '/lms/loan/:id/payments/:payment_id',
				templateUrl: '/components/lms/loan_payments_details.html',
				controller: 'LmsLoanPaymentDetailsController',
				onEnter: function(sidebarMenu, $stateParams) { sidebarMenu.activate('lmsLoanId', $stateParams.id); },
				onExit: function(sidebarMenu) { sidebarMenu.deactivate('lmsLoanId'); },
			})
			.state('lmsSetupLoanTypes', {
				url: '/lms/setup/loan_types',
				templateUrl: '/components/lms/setup_loan_types.html',
				controller: 'LmsSetupLoanTypesController',
			})
			.state('lmsSetupLoanTypesNew', {
				url: '/lms/setup/loan_types/new',
				templateUrl: '/components/lms/setup_loan_types_new.html',
				controller: 'LmsSetupLoanTypesController',
			})
			.state('lmsSetupLoanProducts', {
				url: '/lms/setup/loan_products',
				templateUrl: '/components/lms/setup_loan_products.html',
				controller: 'LmsSetupLoanProductsController',
			})
			.state('lmsSetupLoanProductsForm', {
				url: '/lms/setup/loan_products/:id',
				templateUrl: '/components/lms/setup_loan_products_form.html',
				controller: 'LmsSetupLoanProductItemController',
			})
		;
		
		var lmsHomeItems = [
			{ title: 'Setup Loan Types (1-9)', url: '#/lms/setup/loan_types' },
			{ title: 'Setup Loan Products (1-17)', url: '#/lms/setup/loan_products' },
		];
		sidebarMenuProvider.registerMenuItems('lmsHome', lmsHomeItems);
		
		var lmsLoanIdItems = [
			{ title: 'Loan overview', url: '#/lms/loan/:id' },
			{ title: 'Loan details (2-11)', url: '#/lms/loan/:id/details' },
			{ title: 'Borrower Summary (2-18)', url: '#/lms/loan/:id/borrower' },
			{ title: 'Original amortization schedule (2-16)', url: '#/lms/loan/:id/original_amortization' },
			{ title: 'Current Amortization Schedule (4-12)', url: '#/lms/loan/:id/current_amortization' },
			{ title: 'Update Loan (2-10)', url: '#/lms/loan/:id/form' },
			{ title: 'Enter a new interest rate (2-12)', url: '#/lms/loan/:id/rates' },
			{ title: 'Pay off a loan (4-10)', url: '#/lms/loan/:id/payoff' },
			{ title: 'Create a manual bill (4-14)', url: '#/lms/loan/:id/manual_bill' },
		];
		sidebarMenuProvider.registerMenuItems('lmsLoanId', lmsLoanIdItems);
	}])
	
	.controller('LmsHomeController', ['$scope', function ($scope) {
		$scope.loan_id = 'CL-00001';
	}])
	
	.controller('LmsLoanNewController', ['$scope', function ($scope) {
		
	}])
	
	.controller('LmsLoanHomeController', ['$scope', '$stateParams', function ($scope, $stateParams) {
		$scope.loan_id = $stateParams.id;
		$scope.tmp_id = 'xxx0001';
	}])
	
	.controller('LmsLoanPaymentsController', ['$scope', function ($scope) {
		
	}])
	
	.controller('LmsLoanPaymentDetailsController', ['$scope', '$stateParams', function ($scope, $stateParams) {
		$scope.loan_id = $stateParams.id;
		$scope.payment_id = $stateParams.payment_id;
	}])
	
	
	.controller('LmsSetupLoanTypesController', ['$scope', function ($scope) {
		
	}])
	.controller('LmsSetupLoanProductsController', ['$scope', function ($scope) {
		
	}])
	.controller('LmsSetupLoanProductItemController', ['$scope', '$stateParams', function ($scope, $stateParams) {
		$scope.id = $stateParams.id;
	}])
	