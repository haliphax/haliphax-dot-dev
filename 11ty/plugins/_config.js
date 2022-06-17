const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const config = cfg => {
	cfg.addPlugin(syntaxHighlight);
}

module.exports = config;
