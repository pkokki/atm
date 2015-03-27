var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Space = require('../models/Space.js');

/* GET /spaces listing. */
router.get('/', function(req, res, next) {
	Space.find(function (err, spaces) {
		if (err) return next(err);
		res.json(spaces);
	});
});

/* POST /spaces */
router.post('/', function(req, res, next) {
	Space.create(req.body, function (err, obj) {
		if (err) return next(err);
		res.json(obj);
	});
});

/* GET /spaces/id */
router.get('/:id', function(req, res, next) {
	Space.findById(req.params.id, function (err, obj) {
		if (err) return next(err);
		res.json(obj);
	});
});

/* PUT /spaces/:id */
router.put('/:id', function(req, res, next) {
	delete req.body._id;
	Space.findByIdAndUpdate(req.params.id, req.body, function (err, obj) {
		if (err) return next(err);
		res.json(obj);
	});
});

/* DELETE /spaces/:id */
router.delete('/:id', function(req, res, next) {
	Space.findByIdAndRemove(req.params.id, req.body, function (err, obj) {
		if (err) return next(err);
		res.json(obj);
	});
});

module.exports = router;
