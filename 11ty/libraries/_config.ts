import { UserConfig } from "@11ty/eleventy";

const libraries = {
  md: "markdownIt",
};

const config = (cfg: UserConfig) =>
  Object.entries(libraries).map((l) =>
    cfg.setLibrary(l[0], require(`./${l[1]}`)),
  );

export = config;
