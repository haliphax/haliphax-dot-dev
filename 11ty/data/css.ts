/** CSS combine/minify supplemental configuration */
const data = {
	/** files to include from external resources, to be minified */
	externalStylesheets: {
		synthwave:
			"https://raw.githubusercontent.com/themarcba/prism-themes/master/themes/prism-synthwave84.css",
	},
	/** destination directory (relative to output folder) for font files */
	fontDestination: "fonts",
	/** source folders for font files */
	fontSources: ["node_modules/@fontsource/shrikhand/files"],
	/** files to include from the local filesystem, unchanged */
	localStylesheets: ["node_modules/halfmoon/css/halfmoon-variables.min.css"],
};

export = data;
