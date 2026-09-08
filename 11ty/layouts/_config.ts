const layouts = ["base", "page", "post", "withHeader"];

// @ts-ignore TS7016
const config = (cfg: UserConfig) =>
	layouts.map((l) => cfg.addLayoutAlias(l, `layouts/${l}.11ty.js`));

export = config;
