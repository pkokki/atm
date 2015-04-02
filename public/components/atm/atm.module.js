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
			.state('atm.balanceInquiry', {
				url: '/balanceInquiry',
				templateUrl: '/components/atm/balanceInquiry.html',
				controller: 'AtmBalanceInquiryController'
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
	.factory('atmTerminal', ['$state', function($state) {
		var instantiateTerminal = function() {
			// all properties should be restored to their previous value except the following:
			this.TerminalObjectStatusCode = 'Closed';
			this.RequestedOperationMode = 'TerminalObjectStatusCode value at shutdown';
		};
		var instantiateSecurity = function() {
			// The security objects contain information used to perform cryptographic functions on data.
			// As part of the manufacture and configuration of an ATM, several 
			// security objects will be created (i.e. key encrypting key, PIN encrypting key).
			this.encryptPIN = function(pin) {
				return pin;
			};
		};
		var instantiateDevice = function() {
			// Each of the hardware devices within the ATM has a corresponding
			// logical or software component within the ATM application. These logical objects (e.g. an object to
			// represent the card reader) are dynamically created based on the hardware available to the ATM.
			
		};
		var instantiateServiceProviders = function() {
			this.transactionProvider = null;
			this.maintenanceProvider = null;
			this.inventoryProvider = null;
			
			// Sent to each provider: SignonRq + TerminalSPObjInqRq + SvcProfInqRq
			// The response to these documents is used to verify or configure the features that 
			// will be made available to the ATM applications and the customers that use it.
			// If a service provider does not respond to this document its status should be set to ServiceUnavailable.
			
		};
		var performDeviceSelfTests = function() {
			// Once the basic application objects have been created and communication with service providers
			// established, the ATM will likely perform its internal self test. 
			// If problems are detected a document is sent to the status maintenance server. This document will
			// contain a terminal signon (i.e. SignonRq) and one or more device advise (i.e. DevAdviseRq)
			// messages. See the Device Status section for details on status and fault reporting.
		};
		var activateTerminal = function() {
			// Once the hardware and software is prepared for ATM operation, the ATM will change its terminal
			// object status code to the requested operation mode (normally “Open”). The ATM will also notify
			// the status/maintenance service provider of that change and activate its user interface.
			this.TerminalObjectStatusCode = 'Open';
			// SignonRq + TerminalObjAdviseRq >>> maintenanceProvider
		};
		
		return {
			powerUp: function() {
				// This sequence assumes that communications have been established and keys are synchronized.
				instantiateTerminal();
				instantiateSecurity();
				instantiateDevice();
				instantiateServiceProviders();
				// Server requests client profile information: SignonRq + TerminalObjInq + SvcProfInqRq
				performDeviceSelfTests();
				activateTerminal();
			},
		};
	}])
	
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
			showError: function(data) {
				if ('string' == typeof data) {
					msg = data;
				}
				else if (data.Status) {
					msg = rs.Status.StatusDesc + ' [' + rs.Status.StatusCode + ']';
				}
				else {
					msg = 'Unknown error.';
				}
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
				this.finish();
			},
			end: function() {
				this.ejectCard();
			},
			finish: function() {
				$state.go('atm.continue');
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
		
		settings.favoriteWithdrawalAmounts = [ 50, 100, 200, 300, 500, null ];
		
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
					{ Type: 'Debit', Amount: debit.amount, Currency: debit.currencyCode },
					{ Type: 'Surcharge', Amount: debit.surcharge, Currency: debit.currencyCode }
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
		// Option1: If detailed account information is not known by the client at the time of sending the
		// 			request, the cardAccount JSON should be used to specify an account type associated with 
		// 			the card. Note that when multiple accounts of the type specified (e.g. DDA) are 
		//			associated with the card, the response from the IFX server has status code 3560 
		//			(Card Account ID Matches Multiple Accounts).
		// Option2: If the account details have already been downloaded previously (from a prior 
		//			PartyAcctRelInqRq or SvcAcctInqRq), the account should be fully specified with a 
		//			depAccount JSON.
		var inquiryBalance = function(cardAccount, depAccount) {
			var rq = requestFactory.create();
			if (cardAccount) {
				rq.CardAcctId = {
					AcctType: cardAccount.type,
					CardMagData: {
						MagData2: cardAccount.magData
					}
				};
			}
			else if (depAccount) {
				rq.DepAcctId = {
					AcctId: depAccount.id,
					AcctType: depAccount.type, 
					BankInfo: { /* BankInfo details are country specific */
						BankIdType: depAccount.bankIdType,
						BankId: depAccount.bankId,
					},
				}
			}
			return messageBus.post('api/atm/balanceInquiries', rq);
		};
		
		
		return {
			debitAdd: debitAdd,
			inquiryBalance: inquiryBalance,
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
						console.log(rs);
						if (rs.DebitRecord && rs.DebitRecord.DebitStatus && rs.DebitRecord.DebitStatus.DebitStatusCode == 'Authorized') {
							atmDevice.dispenseCash(amount);
						}
						else {
							atmDevice.showError(rs);
						}
					}, 
					function(err) { 
						atmDevice.showError(err); 
					});
			}
			else {
				$scope.askOther = true;
			}
		};
		$scope.cancelAskOther = function() {
			$scope.askOther = false;
		};
	}])
	
	.controller('AtmBalanceInquiryController', ['$scope', 'atmDevice', 'atmSettings', 'customerService', function ($scope, atmDevice, atmSettings, customerService) {
		var inquiryBalanceSuccess = function(rs) {
			if (rs.Status) {
				// Get the message
				atmDevice.showError(rs);
			}
			else {
				console.log(rs);
				$scope.balances = rs.AccountBalances;
			}
		};
		
		$scope.balances = null;
		$scope.accountTypes = [ 'DDA', 'SDA' ];
		
		$scope.requestBalance = function(type) {
			var accountData = {
				magData: atmDevice.cardMagData,
				type: type,
			};
			customerService.inquiryBalance(accountData).then(inquiryBalanceSuccess, function(err) { atmDevice.showError(err); });
		};
		$scope.finish = function() {
			atmDevice.finish();
		};
	}])
