const transforms = ["htmlMinify"];

// @ts-ignore TS7016
const config = (cfg: UserConfig) =>
	transforms.map((t) => require(`./${t}`)(cfg));

export = config;
