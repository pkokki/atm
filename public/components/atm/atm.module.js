angular.module('app')
	.config(['$stateProvider', '$urlRouterProvider', 'sidebarMenuProvider', function ($stateProvider, $urlRouterProvider, sidebarMenuProvider) {
		$urlRouterProvider.when("/atm", "/atm/intro");
		
		$stateProvider
			.state('atm', {
				abstract: true,
				url: '/atm',
				templateUrl: '/components/atm/device.html',
				controller: 'AtmController',
			})
			.state('atm.intro', {
				url: '/intro',
				templateUrl: '/components/atm/intro.html',
				controller: 'AtmIntroController',
				allowNotAuthenticated: true,
			})
			.state('atm.signon', {
				url: '/signon',
				templateUrl: '/components/atm/signOn.html',
				controller: 'AtmSignOnController',
				allowNotAuthenticated: true,
			})
			.state('atm.inError', {
				url: '/error',
				templateUrl: '/components/atm/error.html',
				controller: 'AtmErrorController',
				allowNotAuthenticated: true,
			})
			.state('atm.home', {
				url: '/home',
				templateUrl: '/components/atm/home.html',
				controller: 'AtmHomeController',
				//onEnter: function(sidebarMenu) { sidebarMenu.activate('atmHome'); },
				//onExit: function(sidebarMenu) { sidebarMenu.deactivate('atmHome'); },
			})
			.state('atm.withdrawal', {
				url: '/withdrawal',
				templateUrl: '/components/atm/withdrawal.html',
				controller: 'AtmWithdrawalController'
			})
			.state('atm.dispenseCash', {
				url: '/dispenseCash',
				templateUrl: '/components/atm/dispenseCash.html',
			})
			.state('atm.continue', {
				url: '/continue',
				templateUrl: '/components/atm/continue.html',
				controller: 'AtmContinueController'
			})
		;
		
		//var atmHomeItems = [
		//	{ title: 'Intro', url: '#/atm/intro' },
		//	{ title: 'Home', url: '#/atm/home' },
		//	{ title: 'Sign on', url: '#/atm/signOn' },
		//];
		//sidebarMenuProvider.registerMenuItems('atmIntro', atmHomeItems);
	}])
	
	/******************************************************************************************************************
	APP RUN ***********************************************************************************************************
	*******************************************************************************************************************/
	
	.run(['$rootScope', '$state', 'atmDevice', function ($rootScope, $state, atmDevice) {
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
			if (toState.name.substr(0, 4) == 'atm.') {
				if (!atmDevice.hasCardInSlot && toState.name != 'atm.intro') {
					atmDevice.suspendRoute(toState, toParams);
					atmDevice.goIntro();
					event.preventDefault();
				}
				else if (!atmDevice.isSignedOn && toState.name != 'atm.signon' && !toState.allowNotAuthenticated) {
					atmDevice.suspendRoute(toState, toParams);
					atmDevice.goSignon();
					event.preventDefault();
				}
			}
		});
	}])
	
	/******************************************************************************************************************
	SERVICES/FACTORIES ************************************************************************************************
	*******************************************************************************************************************/
	
	.factory('atmDevice', ['$state', function($state) {
		var toState = null,
			toParams = null;
			
		var service = {
			cardMagData: '4485413657458239=543',
			hasCardInSlot: true,
			isSignedOn: true,
			cash: 0,
			hasCash: false,
			langPreference: 'en-US',
			errorMessage: null,
			goIntro: function() {
				$state.go('atm.intro');
			},
			goSignon: function() {
				$state.go('atm.signon');
			},
			goHome: function() {
				$state.go('atm.home');
			},
			suspendRoute: function(toState, toParams) {
				this.toState = toState;
				this.toParams = toParams;
			},
			resumeRoute: function() {
				if (this.toState) {
					$state.go(this.toState.name, this.toParams);
				}
				else {
					this.goHome();
				}
				this.toState = null;
				this.toParams = null;
			},
			signonCompleted: function(magData, language) {
				this.cardMagData = magData;
				this.langPreference = language;
				this.isSignedOn = true;
				this.resumeRoute();
			},
			showError: function(msg) {
				this.lastErrorMessage = msg;
				$state.go('atm.inError');
			},
			insertCard: function(magData) {
				this.cardMagData = magData;
				this.hasCardInSlot = true;
				$state.go('atm.signon');
			},
			ejectCard: function() {
				this.cardMagData = null;
				this.hasCardInSlot = false;
				this.isSignedOn = false;
				this.langPreference = 'en-US';
				this.errorMessage = null;
				this.goIntro();
			},
			dispenseCash: function(amount) {
				if (amount > 0) {
					this.cash = amount;
					this.hasCash = true;
					$state.go('atm.dispenseCash');
				}
			},
			retrieveCash: function() {
				this.cash = 0;
				this.hasCash = false;
				$state.go('atm.continue');
			},
			end: function() {
				this.ejectCard();
			},
		};
		return service;
	}])
	
	.factory('atmSettings', [function() {
		var settings = {};
		settings.minWithdrawalAmount = 20;
		settings.maxWithdrawalAmount = 2000;
		settings.withdrawalAmountStep = 20;
		settings.errorTimeout = 3000;
		settings.defaultLanguage = 'en-US';
		
		settings.networkOwner = 'ATM';
		settings.terminalId = '56789';
		settings.terminalLocation = null;
		
		settings.currencyCode = 'EUR';
		settings.debitSurcharge = 1.50;
		
		settings.clientApp = {
			org: 'IFX Forum',
			name: 'IFX ATM/POS Base Client',
			version: '0.1',
		};
		
		return settings;
	}])
	
	.factory('requestFactory', ['atmSettings', 'guid', function(atmSettings, guid) {
		var service = {
			create: function() {
				return {
					RqUID: guid.newGuid(),
					MsgRqHdr: {
						NetworkTrnInfo: {
							NetworkOwner: atmSettings.networkOwner,
							TerminalId: atmSettings.terminalId,
							Location: atmSettings.terminalLocation,
						}/*,
						MsgAuthCode: {
							MacValue: '977B9D6AFCCD7F9A304A480666066039'
						}*/
					},
				};
			}
		};
		return service;
	}])
	
	.factory('messageBus', ['$http', '$q', function($http, $q) {
		function handleSuccess(response) {
			return(response.data);
		}
		
		function handleError(response) {
			if (response.data)
				console.log(response.data);
			if (!response.statusText) {
				return($q.reject("An unknown error occurred."));
			}
			return($q.reject(response.statusText));
		}
				
		var service = {};
		service.post = function(url, data) {
			var request = $http({
				method: "post",
				url: url,
				data: data
			});
			return( request.then( handleSuccess, handleError ) );
		}
		return service;
	}])
	
	.factory('signonService', ['atmSettings', 'messageBus', function(atmSettings, messageBus) {
		var service = {
			signon: function(cardMagData, pinBlock) {
				var rq = {
					SignonMagPIN: {
						CardMagData: {
							MagData2: cardMagData
						},
						PINBlock: pinBlock
					},
					ClientDate: new Date(),
					CustLangPref: atmSettings.defaultLanguage,
					ClientApp: atmSettings.clientApp
				};
				return messageBus.post('api/atm/signon', rq);
			}
		};
		return service;
	}])
	
	.factory('customerService', ['messageBus', 'requestFactory', function(messageBus, requestFactory) {
		var debitAdd = function(debit) {
			var rq = requestFactory.create();
			rq.DebitInfo = {
				DebitAuthType: 'CashWithdrawal',
				CompositeCurAmts: [
					{ Type: 'Debit', Amount: debit.Amount, Currency: debit.currencyCode },
					{ Type: 'Surcharge', Amount: debit.debitSurcharge, Currency: debit.currencyCode }
				],
				CardAcctId: {
					AcctType: debit.accountType,
					CardMagData: {
						MagData2: debit.cardMagData
					}
				}
			};
			return messageBus.post('api/atm/debitAdds', rq);
		};
		
		
		return {
			debitAdd: debitAdd
		};
	}])
	
	/******************************************************************************************************************
	CONTROLLERS *******************************************************************************************************
	*******************************************************************************************************************/
	.controller('AtmController', ['$scope', 'atmDevice', function ($scope, atmDevice) {
		$scope.validCards = [ 
			'5105105105105100=100', /* Mastercard */
			'4111111111111111=100', /* VISA */
			'4485413657458239=543', /* VISA */
			'4929161404848848=450', /* VISA */
		];
		$scope.invalidCards = [ 
			'4222222222222220=123', /* VISA, Invalid Card */
			'5112000200000002=200', /* Mastercard, CVV Match Fail */
			'4457000300000007=901', /* VISA, CVV Unsupported */
		];
		$scope.atm = atmDevice;
		$scope.cardSelected = function(card) {
			atmDevice.insertCard(card);
		};
		$scope.eject = function() {
			atmDevice.ejectCard();
		};
		$scope.takeMoney = function() {
			atmDevice.retrieveCash();
		};
		$scope.clickKey = function(key) {
			if (key == 'HOME') {
				atmDevice.goHome();
			}
		};
	}])
	
	.controller('AtmErrorController', ['$scope', '$timeout', 'atmDevice', 'atmSettings', function ($scope, $timeout, atmDevice, atmSettings) {
		$scope.errorMessage = atmDevice.lastErrorMessage;
		$timeout(function() { atmDevice.goHome(); }, atmSettings.errorTimeout);
	}])
	
	.controller('AtmIntroController', ['$scope', 'atmDevice', function ($scope, atmDevice) {
		$scope.next = function() {
			atmDevice.goSignon();
		};
	}])
	
	.controller('AtmSignOnController', ['$scope', 'signonService', 'atmDevice', function ($scope, signonService, atmDevice) {
		$scope.userinfo = {
			magData: atmDevice.cardMagData,
			pin: '0123456789ABCDEF0123456789ABCDEF'
		};
		
		$scope.requestSignon = function(userinfo) {
			signonService.signon(userinfo.magData, userinfo.pin).then(
				function(response) {
					if (response.Status && response.Status.Severity === 'Error') {
						// Signon error
						$scope.errMessage = response.Status.StatusDesc + ' [' + response.Status.StatusCode + ']';
					}
					else {
						// Succesful signon
						atmDevice.signonCompleted(userinfo.magData, response.Language)
					}
				},
				function(response) {
					atmDevice.showError(errorMessage);
				}
			);
		}
	}])
	
	.controller('AtmContinueController', ['$scope', 'atmDevice', function ($scope, atmDevice) {
		$scope.continue = function() {
			atmDevice.goHome();
		};
		$scope.end = function() {
			atmDevice.end();
		};
	}])
	
	.controller('AtmHomeController', ['$scope', function ($scope) {
		
	}])
	
	.controller('AtmWithdrawalController', ['$scope', 'atmDevice', 'atmSettings', 'customerService', function ($scope, atmDevice, atmSettings, customerService) {
		$scope.settings = atmSettings;
		$scope.favoriteAmounts = [ 50, 100, 200, null ];
		$scope.askOther = false;
		
		$scope.requestWithdrawal = function(amount) {
			if (amount) {
				var debit = {
					cardMagData: atmDevice.cardMagData,
					accountType: 'Unknown',
					amount: amount,
					surcharge: atmSettings.debitSurcharge,
					currencyCode: atmSettings.currencyCode,
				};
				customerService.debitAdd(debit).then(
					function(rs) { 
						if (rs.DebitRec && rs.DebitRec.DebitStatus && rs.DebitRec.DebitStatus.DebitStatusCode == 'Authorized') {
							atmDevice.dispenseCash(amount);
						}
						else {
							var errorMessage = rs.Status ? (rs.Status.StatusDesc + ' [' + rs.Status.StatusCode + ']') : 'Unknown error.';
							atmDevice.showError(errorMessage);
						}
					},
					function(errorMessage) { 
						atmDevice.showError(errorMessage);
					}
				);
			}
			else {
				$scope.askOther = true;
			}
		};
		$scope.cancelAskOther = function() {
			$scope.askOther = false;
		};
	}])
	
