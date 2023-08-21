import cp from "child_process";
import { promisify } from "util";

const exec = promisify(cp.exec);

/** get hash ref of the most recent commit in the repository */
const getHashRef = async () =>
	(await exec("git rev-parse --short HEAD")).stdout;

export = getHashRef;
