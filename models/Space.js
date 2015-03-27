var mongoose = require('mongoose');

var serviceDescriptor = {
	uri: String,
};

var SpaceSchema = new mongoose.Schema({
	name: String,
	merchant_code: String,
	type: { type: String, enum: ['dev', 'prod'], default: 'dev' },
	description: String,
	updated_at: { type: Date, default: Date.now },
	database_type: { type: String, enum: ['mssql', 'oracle', 'sybase'], default: 'mssql' },
	services: { type: {
		org: { type: serviceDescriptor },
		cmis: { type: serviceDescriptor },
		cases: { type: serviceDescriptor },
		tasks: { type: serviceDescriptor },
		rules: { type: serviceDescriptor },
		domains: { type: serviceDescriptor },
		templates: { type: serviceDescriptor },
	}},
});

module.exports = mongoose.model('Space', SpaceSchema);