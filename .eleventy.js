const CleanCSS = require('clean-css');
const fs = require('fs');
const { PurgeCSS } = require('purgecss');

module.exports = cfg => {
	// load the various packages that make up the site and its functionality
	[
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

	cfg.on('eleventy.after', async ({ dir }) => {
		const clean = new CleanCSS();
		const purged = await new PurgeCSS().purge({
			content: [`${dir.output}/**/*.html`, `${dir.output}/*.html`],
			css: [`${dir.output}/**/*.css`],
		});
		const files = {};
		const combo = [
			fs.readFileSync('node_modules/halfmoon/css/halfmoon-variables.min.css'),
		];

		for (let p of purged) {
			if (p.file in files) continue;

			combo.push(clean.minify(p.css).styles);
			files[p.file] = true;
		}

		const stylesheet = `${dir.output}/css/styles.min.css`;

		if (fs.existsSync(stylesheet)) {
			fs.rmSync(stylesheet);
		}

		fs.writeFileSync(stylesheet, combo.join('\n'));

		// TODO purge feather-sprite.svg
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
