const slugify = require('slugify');
const md = require('./markdownLib');

module.exports = (items, limit) => /*html*/`
	<div class="card border mx-0 mt-0 pb-0 pt-10">
		<ul class="list-unstyled">
			${Array.from(items).reverse().slice(0, limit)
				.map(p => {
					const slug = slugify(p.url);
					let summary = (p.template.frontMatter.excerpt
						|| md.render(p.template.frontMatter.content)
							.replace(/<[^>]+>/g, ' ')
							.replace(/\s{2,}/g, ' ')
							.replace(/\n/g, ' ')
							.slice(0, 200));

					return /*html*/`
						<li>
							<a href="${p.url}" id="${slug}"
								class="btn btn-secondary d-inline-block">
								<span class="far fa-sticky-note"></span>
								${p.data.title}
							</a>
							<article aria-labelledby="${slug}"
								class="d-inline-block ml-10">
								<p>${summary}</p>
							</article>
						</li>
						`;
				}).join('')}
		</ul>
	</div>
	`;
