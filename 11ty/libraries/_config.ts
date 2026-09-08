const libraries = {
	md: "markdownIt",
};

// @ts-ignore TS7016
const config = (cfg: UserConfig) =>
	Object.entries(libraries).map((l) =>
		cfg.setLibrary(l[0], require(`./${l[1]}`)),
	);

export = config;
