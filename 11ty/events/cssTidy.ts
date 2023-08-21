import { UserConfig } from "@11ty/eleventy";
import CleanCSS from "clean-css";
import fs from "fs";
import { PurgeCSS } from "purgecss";
import { promisify } from "util";
import cssConfig from "../data/css";
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
		const localStylesheets = [
			// preload "keep file" styles
			clean.minify(await readFile(`${dir.output}/css/keep.css`)).styles,
		];

		for (let fn of cssConfig.localStylesheets) {
			localStylesheets.push(await readFile(fn, fileOpts));
		}

		// download external stylesheets to destination folder
		for (let [fn, url] of Object.entries(cssConfig.externalStylesheets)) {
			await writeFile(
				`${dir.output}/css/${fn}.css`,
				await fetch(url).then((r) => r.text()),
				fileOpts,
			);
		}

		/** files to combine */
		const combo = [...localStylesheets];

		/** files which have already been purged; used to avoid duplication */
		const files: Map<string, boolean> = new Map([
			// avoid processing destination file that may exist from previous runs
			[stylesheet, true],
			// avoid processing "keep file"
			[`${dir.output}/css/keep.css`, true],
		]);

		/** purged files */
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

		// write final stylesheet
		await writeFile(stylesheet, combo.join("\n"));

		// copy dependent font resources
		const fontDestination = `${dir.output}/${cssConfig.fontDestination}`;

		if (!(await exists(fontDestination))) {
			await mkdir(fontDestination);
		}

		for (let dir of cssConfig.fontSources) {
			const fonts = await readdir(dir, fileOpts);

			for (let font of fonts) {
				await cp(`${dir}/${font}`, `${fontDestination}/${font}`);
			}
		}
	});
};

export = cssTidy;
