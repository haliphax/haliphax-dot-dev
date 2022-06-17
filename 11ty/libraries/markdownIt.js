const markdownIt = require('markdown-it');
// plugins
const anchor = require('markdown-it-anchor');

const md = markdownIt({
	html: true,
	linkify: true,
	xhtmlOut: true,
});

md.use(anchor, {
	permalink: anchor.permalink.linkInsideHeader({
		symbol: `
			<span class="sr-only">Jump to heading</span>
			<span aria-hidden="true">#</span>
			`,
		placement: 'after',
	})
});

module.exports = md;
