const slugify = require('slugify');
const md = require('./markdownLib.js');

module.exports = (items, limit) => /*html*/`
	<hr />
	<ul class="list-unstyled">
		${Array.from(items).reverse().slice(0, limit)
			.map(p => {
				const slug = slugify(p.url);
				let summary = p.template.frontMatter.excerpt;

				if (summary)
					summary = `<p>${summary}</p>`;
				else
					summary = md.render(
						p.template.frontMatter.content.slice(0, 200));

				return /*html*/`
					<li>
						<a href="${p.url}" id="${slug}"
							class="btn btn-primary d-inline-block">
							${p.data.title}
						</a>
						<article aria-labelledby="${slug}"
							class="d-inline-block ml-10">
							${summary}
						</article>
					</li>
					`;
			}).join('')}
	</ul>
	<hr />
	`;
