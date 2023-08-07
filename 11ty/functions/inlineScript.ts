import fs from "fs";
import { promisify } from "util";
import { fileOpts } from "../misc";

const readFile = promisify(fs.readFile);

/** inline script file with anonymous, auto-executing function */
const inlineScript = async (...paths: string[]) =>
	`(()=>{${(
		await paths.reduce(
			async (p: Promise<string[]>, c: string) =>
				(await p).concat(`{\n${await readFile(c, fileOpts)}\n}`),
			Promise.resolve([]),
		)
	).join("")}})();`;

export = inlineScript;
