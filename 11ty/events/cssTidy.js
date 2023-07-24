const CleanCSS = require('clean-css');
const fs = require('fs');
const { PurgeCSS } = require('purgecss');

const cssTidy = (cfg) => {
	cfg.on('eleventy.after', async ({ dir }) => {
		const clean = new CleanCSS();
		const purged = await new PurgeCSS().purge({
			content: [`${dir.output}/**/*.html`, `${dir.output}/*.html`],
			css: [`${dir.output}/css/*.css`],
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
	});
};

module.exports = cssTidy;
