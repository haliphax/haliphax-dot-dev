import cp from "child_process";
import { promisify } from "util";

const exec = promisify(cp.exec);
let hashref: string | null = null;

/** get hash ref of the most recent commit in the repository */
const getHashRef = async () => {
	if (!hashref)
		hashref = (await exec("git rev-parse --short HEAD")).stdout.trim();
	return hashref;
};

export = getHashRef;
