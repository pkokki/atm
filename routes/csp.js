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
	atmMessages.DebitAddRq.create(req.body, function (err, rqObj) {
		if (err) return next(err);
		txProcessor.authorizeDebit(rqObj, function(err, rqObj, debit) {
			if (err) return next(err);
			var rsObj = {
				RqUID: rqObj._id,
				MsgRsHdr: {
					ServerTerminalSeqId: '1234567',
					/*MsgAuthCode: {
						MacValue: '4ADE4997AE5076C6B2D7CF7C3C266C6F'
					}*/
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
		
		
	});
});

module.exports = router;