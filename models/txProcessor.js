var mongoose = require('mongoose');

var accountTypes = {
	classes: [ 'deposit', 'credit', 'loan' ],
	types: {
		deposit: [
			{ Code: 'DDA', Name: 'Demand Deposit Account', Description: 'An account paying funds on demand without notice of intended withdrawal. Also known as a Checking Account.' },
			{ Code: 'SDA', Name: 'Savings Deposit Account', Description: 'An interest-bearing deposit account without a stated maturity, as opposed to a time deposit.' },
			{ Code: 'CDA', Name: 'Certificate of Deposit', Description: 'A large denomination time deposit bearing a stipulated interest, payable at maturity.' },
			{ Code: 'MMA', Name: 'Money Market Account', Description: 'An interest bearing demand deposit account investing in private and government obligations with a maturity of one year or less.' },
			{ Code: 'CMA', Name: 'Cash Management Account', Description: 'A personal financial management account usually combining a checking account, a money market account, a brokerage margin account and a debit card. It is considered to be a deposit-type account.' },
		],
		credit: [
			{ Code: 'CCA', Name: 'Credit Card Account', Description: 'An account linked to a pre-approved line of credit where a person with satisfactory credit rating makes retail purchases or obtains cash advances using a payment card.' },
			{ Code: 'LOC', Name: 'Consumer Line of Credit', Description: 'A commitment by a financial institution to lend funds to an individual up to a specified amount over a specified future period.' },
		],
		loan: [
			{ Code: 'EQU', Name: 'Home Equity Loan', Description: 'A loan and/or line of credit that uses a home as collateral.' },
			{ Code: 'ILA', Name: 'Installment Loan Account', Description: 'A loan repaid with interest owed, in equal periodic payments of principal and interest.' },
			{ Code: 'CLA', Name: 'Commercial Loan Account', Description: 'A loan to a corporation, commercial enterprise, or joint venture, as opposed to a loan to a consumer.' },
			{ Code: 'MLA', Name: 'Mortgage Loan Account', Description: 'An extension of real estate credit, usually on a long-term basis. The real estate is the lender’s security.' },
		],
	},
	getAllTypeCodes: function() {
		if (this.cachedCodes)
			return this.cachedCodes;
		this.cachedCodes = [];
		for (var i =0; i < this.classes.length; i++) {
			var types = this.types[this.classes[i]];
			for (var j =0; j < types.length; j++) {
				this.cachedCodes.push(types[j].Code);
			}
		}
		return this.cachedCodes;
	}
};



var AccountSchema = new mongoose.Schema({
	Class: { type: String, required: true, 
		enum: {
			values: accountTypes.classes, 
			message: 'enum validation failed for path "{PATH}" with value "{VALUE}"' 
		} 
	},
	Type: { type: String, required: true, 
		enum: { 
			values: accountTypes.getAllTypeCodes(), 
			message: 'enum validation failed for path "{PATH}" with value "{VALUE}"' 
		} 
	},
	Number: { type: String, unique: true, required: true },
	//Cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
});

var CardSchema = new mongoose.Schema({
	MagData: { type: String, unique: true, required: true },
	PINBlock: { type: String },
	Accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
});

//CardSchema.methods.findSimilarTypes = function (cb) {
//	this.model('Card').find({ type: this.type }, cb);
//}

var Card = mongoose.model('Card', CardSchema),
	Account = mongoose.model('Account', AccountSchema)
	;


function createResponse() {
	var rs = {
		RsHeader: {
			ServerTerminalSeqId: 'ServTerm0001',
			/*MsgAuthCode: {
				MacValue: '',
			}*/
		}
	};
	return rs;
}
	
module.exports = {
	debitAdd: function(txRq, fn) {
		var payload = {
			DebitRecord: {
				DebitId: '12341234',
				DebitInfo: txRq.RqPayload.DebitInfo,
				DebitStatus: {
					DebitStatusCode: 'Authorized',
					EffDate: new Date()
				}
			}
		};
		var status = {			
			StatusCode: 2940,
			Severity: 'Error',
			StatusDesc: 'Insufficient funds',
		};
		
		var txRs = createResponse();
		//txRs.RsStatus = status;
		txRs.RsPayload = payload;
		
		if ('function' == typeof fn)
			fn(null, txRq, txRs);
	},
	
	balInq: function(txRq, fn) {
		var txRs = createResponse();
		
		if ('function' == typeof fn)
			fn(null, txRq, txRs);
	},
};


