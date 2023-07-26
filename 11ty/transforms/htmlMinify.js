const { DOMParser } = require('@xmldom/xmldom');
const { minify } = require('html-minifier');
const { transform } = require('esbuild');

const scriptCache = {};
const parser = new DOMParser({ errorHandler: { warning: () => { } } });

const htmlMinify = cfg =>
	cfg.addTransform('htmlMinify', async (content, outputPath) => {
		if (!outputPath?.endsWith('.html')) {
			return content;
		}

		const doc = parser.parseFromString(content, 'text/html');
		const scripts = Array.from(doc.getElementsByTagName('script'))
			.filter(v => !v.src);

		for (let script of scripts) {
			if (script.id && scriptCache.hasOwnProperty(script.id)) {
				script.textContent = scriptCache[script.id];
				continue;
			}

			script.textContent =
				(await transform(script.textContent, { minify: true })).code;
			scriptCache[script.id] = script.textContent;
		}

		return minify(doc.toString(), {
			useShortDoctype: true,
			removeComments: true,
			collapseWhitespace: true,
		});
  });

module.exports = htmlMinify;
