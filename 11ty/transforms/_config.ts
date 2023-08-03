import { UserConfig } from "@11ty/eleventy";

const transforms = [
	'htmlMinify',
]

const config = (cfg: UserConfig) => transforms.map(t => require(`./${t}`)(cfg));

export = config;
