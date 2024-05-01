import markdownIt from "markdown-it";
// plugins
import anchor from "markdown-it-anchor";

const md = markdownIt({
	html: true,
	linkify: false,
	xhtmlOut: true,
});

md.use(anchor, {
	permalink: anchor.permalink.linkInsideHeader({
		symbol: /*html*/ `
			<span aria-hidden="true">#</span>
			<span class="sr-only">
				<small>Jump to heading</small>
			</span>
			`,
		placement: "after",
	}),
});

export = md;
