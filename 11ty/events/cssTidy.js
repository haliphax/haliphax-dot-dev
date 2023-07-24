const CleanCSS = require('clean-css');
const fs = require('fs');
const { promisify } = require('util');
const { PurgeCSS } = require('purgecss');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/** purge unused rules and combine/minify stylesheets */
const cssTidy = (cfg) => {
	cfg.on('eleventy.after', async ({ dir }) => {
		const stylesheet = `${dir.output}/css/styles.min.css`;

		const clean = new CleanCSS();
		const combo = [
			await readFile('node_modules/halfmoon/css/halfmoon-variables.min.css'),
		];
		const files = { 'docs/css/styles.min.css': true };
		const purged = await new PurgeCSS().purge({
			content: [`${dir.output}/**/*.html`, `${dir.output}/*.html`],
			css: [`${dir.output}/css/*.css`],
		});

		for (let p of purged) {
			if (p.file in files) continue;

			combo.push(clean.minify(p.css).styles);
			files[p.file] = true;
		}

		await writeFile(stylesheet, combo.join('\n'));
	});
};

module.exports = cssTidy;
