var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var atmMessages = require('../models/atmMessages.js');
var txProcessor = require('../models/txProcessor.js');

/* POST /signon */
router.post('/signon', function(req, res, next) {
	atmMessages.SignonRq.create(req.body, function (err, rqObj) {
		if (err) return next(err);
		var rsObj = {
			_ReqId: rqObj._id,
			ClientDate: rqObj.ClientDate,
			ServerDate: new Date(),
			Language: rqObj.CustLangPref,
		};
		var magData = rqObj.SignonMagPIN.CardMagData.MagData2;
		var pinBlock = rqObj.SignonMagPIN.PINBlock;
		// Signon logic
		if (pinBlock.length != 32) {
			console.info(rqObj);
			rsObj.Status = {
				StatusCode: 1740,
				Severity: 'Error',
				StatusDesc: 'Authentication Failed'
			};
		}
		atmMessages.SignonRs.create(rsObj, function (err, obj) {
			if (err) return next(err);
			res.json(obj);
		});
	});
});

/* POST /debitAdds */
router.post('/debitAdds', function(req, res, next) {
	processTransaction('DebitAdd', txProcessor.debitAdd, req, res, next);
	/*
	atmMessages.DebitAddRq.create(req.body, function (err, rqObj) {
		if (err) return next(err);
		txProcessor.authorizeDebit(rqObj, function(err, rqObj, debit) {
			if (err) return next(err);
			var rsObj = {
				RqUID: rqObj._id,
				MsgRsHdr: {
					ServerTerminalSeqId: '1234567',
				},
			};
			if (debit) {
				rsObj.DebitRec = {
					DebitId: debit.Id,
					DebitInfo: rqObj.DebitInfo,
					DebitStatus: {
						DebitStatusCode: 'Authorized',
						EffDate: new Date()
					}
				};
			}
			else {
				rsObj.Status = {
					StatusCode: 2940,
					Severity: 'Error',
					StatusDesc: 'Insufficient funds',
				};
			}
			res.json(rsObj);
		});
		
		
	});*/
});

/* POST /balanceInquiries */
router.post('/balanceInquiries', function(req, res, next) {
	processTransaction('BalInq', txProcessor.balInq, req, res, next);
});

function processTransaction(txType, processor, req, res, next) {
	var txRq = mapRequestToTransaction(txType, req);
	atmMessages.Transaction.create(txRq, function (err, txRq) {
		if (err) return next(err);
		processor(txRq, function(err, txRq, txRs) {
			if (err) return next(err);
			atmMessages.Transaction.update({ _id: txRq._id }, { $set: txRs}, function (err) {
				if (err) return next(err);
				var rsObj = mapTransactionToResponse(txRq, txRs);
				res.json(rsObj);
				console.info(JSON.stringify(rsObj));
			});
		});
	});
}

function mapRequestToTransaction(txType, req) {
	var reqBody = req.body || {};
	var txReq = {
		TranType: txType,
		RqUID: reqBody.RqUID,
		RqHeader: reqBody.MsgRqHdr
	};
	delete reqBody.RqUID;
	delete reqBody.MsgRqHdr;
	txReq.RqPayload = reqBody;
	return txReq;
}

function mapTransactionToResponse(txRq, txRs) {
	var rs = txRs.RsPayload || {};
	rs.RqUID = txRq.RqUID;
	if (txRs.RsStatus)
		rs.Status = txRs.RsStatus;
	if (txRs.RsHeader)
		rs.MsgRsHdr = txRs.RsHeader;
	return rs;
}

module.exports = router;