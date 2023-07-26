const svgson = require('svgson');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);

/** file operation options */
const opts = { encoding: 'utf-8' };

const getHtmlFiles = async dir => {
	const entries = await readdir(dir, opts);
	const files = await Promise.all(entries.map(async entry => {
		const resolved = path.resolve(dir, entry);

		if ((await stat(resolved)).isDirectory()) return getHtmlFiles(resolved);

		return resolved;
	}));

	return files
		.reduce((p, c) => p.concat(c), [])
		.filter(f => f.endsWith('.html'));
};

/** purge unused icons from Feather Icons sprite sheet */
const iconPurge = (cfg) => {
	cfg.on('eleventy.after', async ({ dir }) => {
		const files = await getHtmlFiles(dir.output);
		const iconRegex = /<use href="\/img\/feather-sprite\.svg#([^"]+)"/gi;
		const iconsUsed = {};

		for (let f of files) {
			const content = await readFile(f, opts);
			let match;

			do {
				match = iconRegex.exec(content);
				if (match !== null) iconsUsed[match[1]] = true;
			} while (match);
		};

		const svg = await svgson.parse(
			await readFile(`${dir.output}/img/feather-sprite.svg`, opts)
		);
		const defs = svg.children[0];

		for (let i = 0; i < defs.children.length; i++) {
			const icon = defs.children[i];
			if (!iconsUsed.hasOwnProperty(icon.attributes["id"])) delete icon;
		}

		await writeFile(
			`${dir.output}/img/feather-sprite.svg`,
			svgson.stringify(svg),
			opts
		);
	});
};

module.exports = iconPurge;
