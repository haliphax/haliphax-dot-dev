const handlers = ["cssTidy", "iconPurge"];

// @ts-ignore TS7016
const config = (cfg: UserConfig) => handlers.map((h) => require(`./${h}`)(cfg));

export = config;
