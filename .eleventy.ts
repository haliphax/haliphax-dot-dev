import { UserConfig } from '@11ty/eleventy';
import { fileOpts } from './11ty/misc';
import { readFileSync } from 'fs';

export = (cfg: UserConfig) => {
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
			ready(_: any, browserSync: any) {
				const content_404 = readFileSync('docs/404.html', fileOpts);

				browserSync.addMiddleware('*', (_: any, res: any) => {
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
