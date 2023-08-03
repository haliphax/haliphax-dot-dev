import { UserConfig } from "@11ty/eleventy";

const handlers = [
	'cssTidy',
	'iconPurge',
];

const config = (cfg: UserConfig) => handlers.map(h => require(`./${h}`)(cfg));

export = config;
