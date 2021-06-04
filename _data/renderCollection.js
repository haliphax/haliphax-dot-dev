const slugify = require('slugify');
const md = require('./markdownLib');

module.exports = (items, limit) => /*html*/`
	<ul class="list-unstyled row d-flex flex-row">
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
					<li class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
						<div class="card m-5 p-20 w-full">
							<h3 class="card-title mb-5">${p.data.title}</h3>
							<hr />
							<article aria-labelledby="${slug}">
								<p class="text-muted">${summary}</p>
							</article>
							<div class="d-block h-20 mb-20 pb-5"></div>
							<div class="text-right position-absolute bottom-0 right-0 mr-10 mb-10">
								<a href="${p.url}" id="${slug}"
									class="btn btn-secondary d-inline-block">
									<span class="far fa-sticky-note"></span>
									<span aria-hidden="true">Read more</span>
									<span class="sr-only">Read article: ${p.data.title}</span>
								</a>
							</div>
						</div>
					</li>
					`;
			}).join('')}
	</ul>
	`;
