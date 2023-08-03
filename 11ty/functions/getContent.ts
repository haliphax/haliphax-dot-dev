import { fileOpts } from "../misc";
import * as fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

const getContent = async (data: any) =>
	(await readFile(data.page.inputPath, fileOpts))
		.replace(/^(.|\n)+?---\n/m, '');

export = getContent;
