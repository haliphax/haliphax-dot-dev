const fs = require('fs');

module.exports = cfg => {
	// load the various packages that make up the site and its functionality
	[
		'events',
		'functions',
		'layouts',
		'libraries',
		'plugins',
		'transforms',
	]
		.map(p => require(`./11ty/${p}/_config`)(cfg));

	cfg.addPassthroughCopy({ 'static': '/' });

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

	cfg.setQuietMode(true);

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
