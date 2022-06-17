const cfgFunctions = require('./11ty/functions/_config');
const cfgLayouts = require('./11ty/layouts/_config');
const cfgTransforms = require('./11ty/transforms/_config');
const fs = require('fs');
const markdownLibrary = require('./11ty/lib/markdownIt');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = cfg => {
	cfgFunctions(cfg);
	cfgLayouts(cfg);
	cfgTransforms(cfg);
	cfg.addPassthroughCopy({ 'static': '/' });
	cfg.addPlugin(syntaxHighlight);
	cfg.setLibrary('md', markdownLibrary);

	// custom excerpt marker
	cfg.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: '<!--more-->',
	});

	// browser sync for hot reload during local development
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

	return {
		dataTemplateEngine: false,
		dir: {
			data: '../11ty/data',
			includes: '../11ty',
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
