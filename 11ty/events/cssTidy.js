const CleanCSS = require('clean-css');
const fs = require('fs');
const { promisify } = require('util');
const { PurgeCSS } = require('purgecss');

const cp = promisify(fs.cp);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/** purge unused rules and combine/minify stylesheets */
const cssTidy = (cfg) => {
	cfg.on('eleventy.after', async ({ dir }) => {
		const opts = { encoding: 'utf-8' };
		const stylesheet = `${dir.output}/css/styles.min.css`;
		const keepDir = 'static/css/keep';

		const clean = new CleanCSS();
		const combo = [
			await readFile('node_modules/halfmoon/css/halfmoon-variables.min.css'),
			clean.minify(await readFile(`${dir.output}/css/keep.css`)).styles,
		];

		const files = {
			'docs/css/keep.css': true,
			'docs/css/styles.min.css': true,
		};
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

		const fontDest = `${dir.output}/fonts`
		const fontSource = 'node_modules/@fontsource/shrikhand/files';

		if (! await exists(fontDest)) await mkdir(fontDest);

		const fonts = await readdir(fontSource, opts);

		for (let font of fonts) {
			await cp(`${fontSource}/${font}`, `${fontDest}/${font}`);
		}
	});
};

module.exports = cssTidy;
