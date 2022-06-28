const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const min = require('html-minifier');
const esbuild = require('esbuild');
const { transformSync } = esbuild;

const scriptCache = {};

const htmlMinify = cfg =>
	cfg.addTransform('htmlMinify', function(content) {
		if (!this.outputPath || !this.outputPath.endsWith('.html')) {
			return content;
		}

		// note: this is _incredibly_ slow :(
		const doc = new JSDOM(content).window.document;
		const scripts = Array.from(doc.scripts).filter(v => !v.src);

		for (let script of scripts) {
			if (script.id && scriptCache.hasOwnProperty(script.id)) {
				console.log(`Cached: ${script.id}`);
				script.textContent = scriptCache[script.id];
				continue;
			}

			script.id && console.log(`Building cache for: ${script.id}`)
			script.textContent =
				transformSync(script.textContent, { minify: true }).code;
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
		const minifiedHtml = min.minify(output, {
			useShortDoctype: true,
			removeComments: true,
			collapseWhitespace: true,
		});

		return minifiedHtml;
  });

module.exports = htmlMinify;
