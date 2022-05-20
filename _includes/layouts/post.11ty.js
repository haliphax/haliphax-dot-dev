const fs = require('fs'),
	htmlEntities = require('../../_functions/htmlEntities'),
	md = require('../markdownLib');

module.exports = class Post {
	get data() {
		return {
			eleventyComputed: {
				metaDescription(data) {
					const content = fs.readFileSync(data.page.inputPath, 'utf8')
						.replace(/^(.|\n)+?---\n/m, '');

					return htmlEntities(md.render(content)
						.replace(/<[^>]+>/g, '')
						.replace(/\s{2,}/g, ' ')
						.replace(/\n/g, ' '))
						.slice(0, 159)
						.replace(/\s+[^ ]*$/, '') + ' &hellip;';
				},
			},
			layout: 'withHeader',
			ogType: 'article',
			permalink(data) {
				const y = data.page.date.getFullYear(),
					m = data.page.date.getMonth() + 1,
					m0 = m < 10 ? `0${m}` : m;

				return `/${y}/${m0}/${data.page.fileSlug}/`;
			},
		};
	}

	render(data) {
		const reformatted = this.htmlEntities(
			data.content.replace(/<\/?h\d+[^>]*>/ig, x =>
				x.replace(/\d/, d => parseInt(d) + 3)));
		const posted = this.page.date.toISOString().replace(/T.*$/, '');

		return /*html*/`
			${this.renderTags(data.tags)}
			<div class="card border mx-0 pb-0 pt-5 mt-0 mb-0">
				${reformatted}
			</div>
			<p class="text-muted" role="contentinfo">
				<span class="fa fa-calendar"></span>
				Posted: <time datetime="${posted}">${posted}</time>
			</p>
			`;
	}
};
