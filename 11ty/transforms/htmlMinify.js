const { JSDOM } = require('jsdom');
const { minify } = require('html-minifier');
const { transform } = require('esbuild');

const scriptCache = {};

const htmlMinify = cfg =>
	cfg.addTransform('htmlMinify', async (content, outputPath) => {
		if (!outputPath?.endsWith('.html')) {
			return content;
		}

		// note: this is _incredibly_ slow :(
		const doc = new JSDOM(content).window.document;
		const scripts = Array.from(doc.scripts).filter(v => !v.src);

		for (let script of scripts) {
			if (script.id && scriptCache.hasOwnProperty(script.id)) {
				script.textContent = scriptCache[script.id];
				continue;
			}

			script.textContent =
				(await transform(script.textContent, { minify: true })).code;
			scriptCache[script.id] = script.textContent;
		}

		const html = doc.children[0].outerHTML;
		const dtd = doc.doctype;
		const doctype = [];

		dtd.name && doctype.push(dtd.name);
		dtd.internalSubset && doctype.push(dtd.internalSubset);
		dtd.publicId && doctype.push(dtd.publicId);
		dtd.systemId && doctype.push(dtd.systemId);

		const output = `<!DOCTYPE ${doctype.join(' ')}>${html}`;

		return minify(output, {
			useShortDoctype: true,
			removeComments: true,
			collapseWhitespace: true,
		});
  });

module.exports = htmlMinify;
