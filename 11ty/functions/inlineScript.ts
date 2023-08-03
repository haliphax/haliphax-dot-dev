import * as fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

/** inline script file with anonymous, auto-executing function */
const inlineScript = async (path: string) =>
    `(() => {\n${await readFile(path)}\n})();`;

export = inlineScript;
