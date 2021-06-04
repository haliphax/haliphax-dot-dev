const fs = require('fs');
const markdownLibrary = require('./_data/markdownLib');

module.exports = function (eleventyConfig) {
	eleventyConfig.addLayoutAlias('base', 'base.11ty.js');
	eleventyConfig.addLayoutAlias('collection', 'collection.11ty.js');
	eleventyConfig.addLayoutAlias('post', 'post.11ty.js');
	eleventyConfig.addLayoutAlias('withHeader', 'withHeader.11ty.js');
	eleventyConfig.addPassthroughCopy('css');
	eleventyConfig.addPassthroughCopy('img');

	eleventyConfig.setDataDeepMerge(true);
	eleventyConfig.setLibrary('md', markdownLibrary);
	eleventyConfig.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: '<!--more-->',
	});
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
		],
		pathPrefix: '/',
		markdownTemplateEngine: 'njk',
		dataTemplateEngine: false,
		dir: {
			input: 'content',
			includes: '../_includes',
			data: '_data',
			output: '_site',
		},
	};
};
