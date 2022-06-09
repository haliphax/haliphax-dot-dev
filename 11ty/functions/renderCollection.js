const { blurbLength, jumboBlurbLength } = require('../data/misc');
const getDescription = require('./getDescription');
const md = require('../lib/markdownIt');
const slugify = require('slugify');

const renderCollection = (items, limit, jumboFirst = false) => /*html*/`
	<ul class="list-unstyled row d-flex flex-row">
		${Array.from(items).reverse().slice(0, limit)
			.map((p, i) => {
				const cutoff = jumboFirst && i === 0 ? jumboBlurbLength : blurbLength;
				const slug = slugify(p.url);
				const content = md.render(
					p.template.frontMatter.excerpt || p.template.frontMatter.content);
				const summary = getDescription(content, cutoff);
				const classes = [];

				if (i > 0 || !jumboFirst) {
					classes.push('col-md-6');
				}

				if (!jumboFirst) {
					classes.push('col-lg-4');
				}

				return /*html*/`
					<li class="col-12 ${classes.join(' ')} d-flex">
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

module.exports = renderCollection;
