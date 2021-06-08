const markdownIt = require('markdown-it');

module.exports = markdownIt({
	html: true,
	linkify: true,
});
