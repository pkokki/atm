describe('09 Identifying A Customer', function() {
	// var firstNumber = element(by.model('first'));
	
	beforeEach(function() {
		browser.get('http://localhost:3000/#/atm');
	});
	
	it('09.05 CUSTOMER CARD VERIFY', function() {
		// Typical successful transaction
		
		// It is assumed that the Customer Card Verify transaction is automatically initiated when the
		// customer enters the card in the ATM.
		
	});
	
	it('09.06 ACCOUNT VERIFY AND OAR', function() {
		// Successful retrieval of a list of accounts which are linked to a card.
	});
	
	it('09.07 CARD CAPTURE', function() {
		// Customer walk away after a time out when attempting to return the card
	});
});