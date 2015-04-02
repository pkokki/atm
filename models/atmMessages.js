var mongoose = require('mongoose');

var postalAddress = {
	Address: String,
	City: String,
	StateProv: String,
	PostalCode: String,
	Country: String,
};

var networkTrnInfo = {
	NetworkOwner: { type: String, required:true },
	TerminalId: { type: String, required:true },
	Location: postalAddress,
};

var messageAuthCode = {
	MacValue: String
};

var messageRequestHeader = {
	NetworkTrnInfo: networkTrnInfo,
	MsgAuthCode: messageAuthCode
};

var compositeCurrencyAmount = {
	Type: { type: String, enum: { values:[ 'Debit', 'Surcharge' ], message: 'enum validation failed for path "{PATH}" with value "{VALUE}"' } },
	Amount: { type: Number, required:true },
	Currency: { type: String, maxlength: 3, trim: true },
};

var cardMagneticData = {
	MagData2: { type: String, required:true }
}

var cardAccountIdentifier = {
	AcctType: String,
	CardMagData: cardMagneticData
}



var debitInfo = {
	DebitAuthType: { type: String, required:true },
	CompositeCurAmts: [compositeCurrencyAmount],
	CardAcctId: cardAccountIdentifier
};

var DebitAddRqSchema = new mongoose.Schema({
	RqUID: { type: String, unique: true, required: true },
	MsgRqHdr: { type: messageRequestHeader, required: true },
	DebitInfo: { type: debitInfo, required: true }
});


var signonMagPIN = {
	CardMagData: cardMagneticData,
	PINBlock: { type: String, required: true }
};

var clientApp = {
	Org: String,
	Name: String,
	Version: String
};

var status = {
	StatusCode: { type: Number },
	Severity: { type: String, enum: { 
		values:['Info', 'Warn', 'Error'], 
		message: 'enum validation failed for path "{PATH}" with value "{VALUE}"' } 
	},
	StatusDesc: String
};

var SignonRqSchema = new mongoose.Schema({
	SignonMagPIN: { type: signonMagPIN, required: true },
	ClientDate: { type: Date, required: true },
	CustLangPref: { type: String, required: true },
	ClientApp : { type: clientApp },
});

var SignonRsSchema = new mongoose.Schema({
	_ReqId: { type: mongoose.Schema.Types.ObjectId, required: true },
	ClientDate: { type: Date, required: true },
	ServerDate: { type: Date, required: true },
	Language: { type: String, required: true },
	Status: status,
});

var messageResponseHeader = {
	MsgAuthCode: messageAuthCode,
	ServerTerminalSeqId: { type: String }
};

var TransactionSchema = new mongoose.Schema({
	TranType: { type: String, required: true, enum: { 
		values:[ 'DebitAdd', 'BalInq' ], 
		message: 'enum validation failed for path "{PATH}" with value "{VALUE}"' } 
	},
	Timestamp: { type: Date, required: true, default: Date.now },
	RqUID: { type: String, unique: true, required: true },
	RqHeader: { type: messageRequestHeader, required: true },
	RqPayload: { type: mongoose.Schema.Types.Mixed },
	RsStatus: { type: status },
	RsHeader: { type: messageResponseHeader },
	RsPayload: { type: mongoose.Schema.Types.Mixed },
});

module.exports = {
	SignonRq: mongoose.model('SignonRq', SignonRqSchema),
	SignonRs: mongoose.model('SignonRs', SignonRsSchema),
	DebitAddRq: mongoose.model('DebitAddRq', DebitAddRqSchema),
	
	Transaction: mongoose.model('Transaction', TransactionSchema),
};