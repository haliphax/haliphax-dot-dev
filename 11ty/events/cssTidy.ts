import { UserConfig } from "@11ty/eleventy";
import CleanCSS from "clean-css";
import fs from "fs";
import { PurgeCSS } from "purgecss";
import { promisify } from "util";
import { EleventyDir, fileOpts } from "../misc";

const cp = promisify(fs.cp);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/** purge unused rules and combine/minify stylesheets */
const cssTidy = (cfg: UserConfig) => {
	cfg.on("eleventy.after", async ({ dir }: { dir: EleventyDir }) => {
		const stylesheet = `${dir.output}/css/styles.min.css`;
		const clean = new CleanCSS();

		/** files to combine */
		const combo = [
			// preload contents of CSS framework
			await readFile(
				"node_modules/halfmoon/css/halfmoon-variables.min.css",
				fileOpts,
			),
			// preload "keep file" styles
			clean.minify(await readFile(`${dir.output}/css/keep.css`)).styles,
		];

		/** files which have already been purged; used to avoid duplication */
		const files: Map<string, boolean> = new Map([
			// avoid purging "keep file"
			["docs/css/keep.css", true],
			// avoid purging destination file that may exist from previous runs
			["docs/css/styles.min.css", true],
		]);

		const purged = await new PurgeCSS().purge({
			content: [`${dir.output}/**/*.html`, `${dir.output}/*.html`],
			css: [`${dir.output}/css/*.css`],
		});

		for (let p of purged) {
			// avoid purging/combining the same file more than once
			if (!p.file || files.has(p.file)) {
				continue;
			}

			combo.push(clean.minify(p.css).styles);
			files.set(p.file, true);
		}

		await writeFile(stylesheet, combo.join("\n"));

		// copy dependent font resources
		const fontDest = `${dir.output}/fonts`;
		const fontSource = "node_modules/@fontsource/shrikhand/files";

		if (!(await exists(fontDest))) {
			await mkdir(fontDest);
		}

		const fonts = await readdir(fontSource, fileOpts);

		for (let font of fonts) {
			await cp(`${fontSource}/${font}`, `${fontDest}/${font}`);
		}
	});
};

export = cssTidy;
