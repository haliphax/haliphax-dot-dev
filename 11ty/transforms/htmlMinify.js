const min = require('html-minifier');

const htmlMinify = cfg =>
	cfg.addTransform('htmlMinify', function(content) {
		if (!this.outputPath || !this.outputPath.endsWith('.html')) {
			return content;
		}

		return min.minify(content, {
			useShortDoctype: true,
			removeComments: true,
			collapseWhitespace: true
		});
  });

module.exports = htmlMinify;
