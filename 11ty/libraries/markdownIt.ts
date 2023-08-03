import markdownIt from 'markdown-it';
// plugins
import anchor from 'markdown-it-anchor';

const md = markdownIt({
	html: true,
	linkify: false,
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

export = md;
