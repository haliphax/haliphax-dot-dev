const fs = require('fs');
const markdownLibrary = require('./_data/markdownLib.js');

module.exports = function (eleventyConfig) {
	eleventyConfig.setDataDeepMerge(true);
	eleventyConfig.addLayoutAlias('base', 'base.11ty.js');
	eleventyConfig.addLayoutAlias('collection', 'collection.11ty.js');
	eleventyConfig.addLayoutAlias('post', 'post.11ty.js');

	const markdownLibrary = markdownIt({
		html: true,
		breaks: true,
		linkify: true,
	});

	eleventyConfig.setLibrary('md', markdownLibrary);
	eleventyConfig.setBrowserSyncConfig({
		callbacks: {
			ready(err, browserSync) {
				const content_404 = fs.readFileSync('_site/404.html');

				browserSync.addMiddleware('*', (req, res) => {
					// Provides the 404 content without redirect.
					res.writeHead(404, {
						'Content-Type': 'text/html; charset=UTF-8'
					});
					res.write(content_404);
					res.end();
				});
			},
		},
		ui: false,
		ghostMode: false,
	});

	return {
		templateFormats: [
			'11ty.js',
			'md',
			'njk',
			'html',
		],
		pathPrefix: '/',
		markdownTemplateEngine: 'njk',
		htmlTemplateEngine: 'njk',
		dataTemplateEngine: false,
		dir: {
			input: 'content',
			includes: '../_includes',
			data: '_data',
			output: '_site',
		},
	};
};
