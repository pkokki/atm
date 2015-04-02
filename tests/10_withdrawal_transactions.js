describe('10 Withdrawal Transactions', function() {
	beforeEach(function() {
		browser.get('http://localhost:3000/#/atm/withdrawal');
	});
	
	it('10.04 Withdrawal', function() {
		// This scenario illustrates a typical successful withdrawal transaction.
		
		// [1]  The customer selects a withdrawal from a deposit 
		// 		account (savings or checking) and agrees to the
		//		associated surcharge fee. Any messages involved with
		//		card type and fee amount determination is out of band.
		element(by.buttonText("Other")).click();
		
		element(by.model('amount')).sendKeys('120');
		//element(by.css('[ng-click="requestWithdrawal(amount)"]')).click();
		element(by.buttonText('Continue')).click();
		
		// http://localhost:3000/#/atm/dispenseCash
		expect(browser.getCurrentUrl()).toContain('#/atm/dispenseCash');
		element(by.css('[ng-click="takeMoney()"]')).click();
		
		// http://localhost:3000/#/atm/continue
		expect(browser.getCurrentUrl()).toContain('#/atm/continue');
	});
	/*
	it('10.05 Favorite Withdrawal', function() {
	
	});
	
	it('10.08 Withdrawal, Acquiring Server (CSP) determines surcharge, customer declines', function() {
	
	});
	
	it('10.09 Withdrawal, Issuing Server determines surcharge', function() {
	
	});
	
	it('10.11 Withdrawal, Issuing Server determines surcharge, customer declines', function() {
	
	});
	
	it('10.11 Withdrawal, device fault', function() {
	
	});
	
	it('10.12 Withdrawal, shutter fault', function() {
	
	});
	
	it('10.13 Withdrawal, communication exception', function() {
	
	});
	
	it('10.14 Withdrawal, partial dispense', function() {
	
	});
	
	it('10.16 Reversal Scenario Summary', function() {
	
	});
	
	it('10.17 Withdrawal Denied Due to “No Sharing Arrangement”', function() {
	
	});
	
	it('10.18 Successful Track Update', function() {
	
	});
	*/
})