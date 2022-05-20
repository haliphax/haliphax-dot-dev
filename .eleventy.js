const fs = require('fs'),
	htmlEntities = require('./_functions/htmlEntities'),
	markdownLibrary = require('./_includes/markdownLib'),
	renderCollection = require('./_functions/renderCollection'),
	renderTags = require('./_functions/renderTags'),
	syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = (cfg) => {
	// functions
	cfg.addJavaScriptFunction('htmlEntities', htmlEntities);
	cfg.addJavaScriptFunction('renderCollection', renderCollection);
	cfg.addJavaScriptFunction('renderTags', renderTags);

	// layouts
	cfg.addLayoutAlias('base', 'layouts/base.11ty.js');
	cfg.addLayoutAlias('collection', 'layouts/collection.11ty.js');
	cfg.addLayoutAlias('post', 'layouts/post.11ty.js');
	cfg.addLayoutAlias('withHeader', 'layouts/withHeader.11ty.js');

	// assets
	cfg.addPassthroughCopy('css');
	cfg.addPassthroughCopy('img');
	cfg.addPassthroughCopy('content/ahrefs_*');

	// plugins
	cfg.addPlugin(syntaxHighlight);

	// browser sync for local development
	cfg.setBrowserSyncConfig({
		callbacks: {
			ready(_, browserSync) {
				const content_404 = fs.readFileSync('docs/404.html');

				browserSync.addMiddleware('*', (_, res) => {
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

	// use markdown-it
	cfg.setLibrary('md', markdownLibrary);

	// customize excerpt tag
	cfg.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: '<!--more-->',
	});

	return {
		dataTemplateEngine: false,
		dir: {
			data: '../_data',
			includes: '../_includes',
			input: 'content',
			output: 'docs',
		},
		markdownTemplateEngine: '11ty.js',
		pathPrefix: '/',
		templateFormats: [
			'11ty.js',
			'md',
		],
	};
};
