import { UserConfig } from "@11ty/eleventy";

const layouts = ["base", "page", "post", "withHeader"];

const config = (cfg: UserConfig) =>
  layouts.map((l) => cfg.addLayoutAlias(l, `layouts/${l}.11ty.js`));

export = config;
