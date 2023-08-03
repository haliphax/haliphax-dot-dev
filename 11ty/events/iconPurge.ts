import { UserConfig } from "@11ty/eleventy";
import fs from "fs";
import path from "path";
import { parse, stringify } from "svgson";
import { promisify } from "util";
import { EleventyDir, fileOpts } from "../misc";

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);

/** helper method to recursively pull a list of all HTML files */
const getHtmlFiles = async (dir: string): Promise<string[]> =>
	(
		await Promise.all(
			(await readdir(dir, fileOpts)).map(async (entry: string) => {
				const resolved = path.resolve(dir, entry);

				if ((await stat(resolved)).isDirectory()) {
					return await getHtmlFiles(resolved);
				}

				return resolved;
			}),
		)
	)
		.reduce<string[]>((p: string[], c: string | string[]) => p.concat(c), [])
		.filter((f: string) => f.endsWith(".html"));

/** purge unused icons from Feather Icons sprite sheet */
const iconPurge = (cfg: UserConfig) => {
	cfg.on("eleventy.after", async ({ dir }: { dir: EleventyDir }) => {
		const files = await getHtmlFiles(dir.output);
		const iconRegex = /<use href="\/img\/feather-sprite\.svg#([^"]+)"/gi;
		const iconsUsed = new Map<string, boolean>();

		// find icons used in each file
		for (let f of files) {
			const content = await readFile(f, fileOpts);
			let match: RegExpExecArray;

			do {
				match = iconRegex.exec(content);

				if (match !== null) {
					iconsUsed.set(match[1], true);
				}
			} while (match);
		}

		const svg = await parse(
			await readFile(`${dir.output}/img/feather-sprite.svg`, fileOpts),
		);
		const defs = svg.children[0];

		// loop through icons, removing unused
		for (let i = 0; i < defs.children.length; i++) {
			const icon = defs.children[i];
			if (!iconsUsed.has(icon.attributes["id"])) delete defs.children[i];
		}

		await writeFile(
			`${dir.output}/img/feather-sprite.svg`,
			stringify(svg),
			fileOpts,
		);
	});
};

export = iconPurge;
