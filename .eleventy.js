const fs = require('fs');
const markdownLibrary = require('./_includes/markdownLib');

module.exports = function (eleventyConfig) {
	// adds
	eleventyConfig.addLayoutAlias('base', 'layouts/base.11ty.js');
	eleventyConfig.addLayoutAlias('collection', 'layouts/collection.11ty.js');
	eleventyConfig.addLayoutAlias('post', 'layouts/post.11ty.js');
	eleventyConfig.addLayoutAlias('withHeader', 'layouts/withHeader.11ty.js');
	eleventyConfig.addPassthroughCopy('css');
	eleventyConfig.addPassthroughCopy('img');

	// sets
	eleventyConfig.setBrowserSyncConfig({
		callbacks: {
			ready(err, browserSync) {
				const content_404 = fs.readFileSync('docs/404.html');

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
	eleventyConfig.setDataDeepMerge(true);
	eleventyConfig.setLibrary('md', markdownLibrary);
	eleventyConfig.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: '<!--more-->',
	});

	return {
		dataTemplateEngine: false,
		dir: {
			data: '_data',
			includes: '../_includes',
			input: 'content',
			output: 'docs',
		},
		markdownTemplateEngine: 'njk',
		pathPrefix: '/',
		templateFormats: [
			'11ty.js',
			'md',
			'njk',
		],
	};
};
