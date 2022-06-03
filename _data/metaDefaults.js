const eleventyPackage = require('@11ty/eleventy/package.json');

module.exports = {
	author: 'haliphax',
	description: 'haliphax streams software development on Twitch.',
	generator: `${eleventyPackage.name} v${eleventyPackage.version}`,
	openGraphType: 'article',
};
