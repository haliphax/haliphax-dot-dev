import { UserConfig } from "@11ty/eleventy";

const plugins = [
	'@11ty/eleventy-plugin-syntaxhighlight',
];

const config = (cfg: UserConfig) => plugins.map(p => cfg.addPlugin(require(p)));

export = config;
