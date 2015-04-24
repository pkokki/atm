var Package = require('dgeni').Package;

// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
var path = require('canonical-path');

// Create and export a new Dgeni package. This package depends upon
// the jsdoc and nunjucks packages defined in the dgeni-packages npm module.
module.exports = new Package('dgeni-package', [
	require('dgeni-packages/ngdoc'),
	require('dgeni-packages/jsdoc'), 
	require('dgeni-packages/nunjucks'),
])


// Configure the log service
.config(function(log) {
  log.level = 'info';
})


// Configure file reading
.config(function(readFilesProcessor) {
	readFilesProcessor.basePath = path.resolve(__dirname, '..');
	readFilesProcessor.sourceFiles = [
		{ include: 'public/**/*.js', exclude: 'public/assets/**/*.js', basePath: 'public' }
	];
})


// Configure file writing
.config(function(writeFilesProcessor) {
	writeFilesProcessor.outputFolder  = 'build';
})

.config(function(templateFinder, templateEngine) {

  // Nunjucks and Angular conflict in their template bindings so change the Nunjucks
  templateEngine.config.tags = {
    variableStart: '{$',
    variableEnd: '$}'
  };

  templateFinder.templateFolders
      .unshift(path.resolve(__dirname, 'templates'));

  templateFinder.templatePatterns = [
    '${ doc.template }',
    '${ doc.id }.${ doc.docType }.template.html',
    '${ doc.id }.template.html',
    '${ doc.docType }.template.html',
    'common.template.html'
  ];
})


.config(function(getLinkInfo) {
	getLinkInfo.relativeLinks = true;
})
;
