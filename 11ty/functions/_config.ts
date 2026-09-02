import { UserConfig } from "@11ty/eleventy";

const functions = [
	"getContent",
	"getDescription",
	"getMetaDescription",
	"htmlEntities",
	"inlineScript",
	"metaEncode",
	"renderArchivedNotice",
	"renderCollection",
	"renderGitHubLink",
	"renderIcon",
	"renderReadingTime",
	"renderTags",
];

const config = (cfg: UserConfig) =>
	functions.map((s) => cfg.addJavaScriptFunction(s, import(`./${s}`)));

export = config;
