plugins = [
	'@11ty/eleventy-plugin-syntaxhighlight',
];

const config = cfg => plugins.map(p => cfg.addPlugin(require(p)));

module.exports = config;
