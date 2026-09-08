const plugins = ["@11ty/eleventy-plugin-syntaxhighlight"];

// @ts-ignore TS7016
const config = (cfg: UserConfig) =>
	plugins.map((p) => cfg.addPlugin(require(p)));

export = config;
