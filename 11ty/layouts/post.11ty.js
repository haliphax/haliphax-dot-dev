const fs = require('fs');
const md = require('../libraries/markdownIt');

const getContent = data => fs.readFileSync(data.page.inputPath, 'utf8')
	.replace(/^(.|\n)+?---\n/m, '')

module.exports = class Post {
	get data() {
		return {
			eleventyComputed: {
				metaDescription(data) {
					return this.getDescription(md.render(getContent(data)))
				},
				readingTime(data) {
					if (!data.tags.includes('post'))
						return null;

					const words = getContent(data)
						.replace(/<[^>]*>|&\w+;/ig, '')
						.split(/\n+/)
						.filter(s => s)
						.map(s => s.split(/\s+/).length)
						.reduce((p, c) => p + c)
					const wpm = data.misc.readingTimeWpm;
					const readTime = Math.max(1, Math.round(words / wpm));

					return `${readTime} minute${readTime !== 1 ? 's' : ''}`;
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
		const encodedPath = encodeURIComponent(
			[data.strings.githubRoot, this.page.inputPath.substring(1)].join(''));
		const githubLink = `https://github.com/login?return_to=${encodedPath}`;

		return /*html*/`
			${this.renderTags(data.tags)}
			<div class="mb-10 d-flex flex-row flex-grow-1">
				<small class="text-muted flex-fill ai-center">
					<i class="fa fa-clock" aria-hidden="true">&nbsp;</i>
					Reading time: ${data.readingTime}
				</small>
				<small>
					<a href="${githubLink}" class="no-external">
						<i class="fa fa-edit" aria-hidden="true"></i>
						Suggest an edit
					</a>
				</small>
			</div>
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
