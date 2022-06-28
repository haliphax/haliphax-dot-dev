const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const min = require('html-minifier');
const esbuild = require('esbuild');
const { transformSync } = esbuild;

const htmlMinify = cfg =>
	cfg.addTransform('htmlMinify', function(content) {
		if (!this.outputPath || !this.outputPath.endsWith('.html')) {
			return content;
		}

		const doc = new JSDOM(content).window.document;
		const scripts = Array.from(doc.scripts).filter(v => !v.src);

		for (let script of scripts) {
			script.textContent =
				transformSync(script.textContent, { minify: true }).code;
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
