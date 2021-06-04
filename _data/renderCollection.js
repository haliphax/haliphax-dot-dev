const slugify = require('slugify');
const md = require('./markdownLib');

module.exports = (items, limit) => /*html*/`
	<div class="card border mx-0 mt-0 pb-0 pt-10">
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
								class="btn btn-secondary d-inline-block">
								<span class="far fa-sticky-note"></span>
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
	</div>
	`;
