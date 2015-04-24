var Dgeni = require('dgeni');

module.exports = function(grunt) {

	grunt.registerTask('dgeni', 'Generate docs via dgeni.', function() {
		var done = this.async();
		var dgeni = new Dgeni([require('./docs/dgeni-package')]);
		dgeni.generate().then(function(docs) {
			console.log('Created ' + docs.length + ' documents.');
			done();
		});
	});

	grunt.registerTask('default', ['dgeni']);

};