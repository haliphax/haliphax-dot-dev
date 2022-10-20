module.exports = class Post {
	get data() {
		return {
			eleventyComputed: {
				metaDescription(data) {
					return this.getMetaDescription(data);
				},
			},
			layout: 'withHeader',
			ogType: 'article',
			permalink(data) {
				const y = data.page.date.getFullYear(),
					m = data.page.date.getMonth() + 1,
					m0 = m < 10 ? `0${m}` : m;

				return `/${y}/${m0}/${data.page.fileSlug}/`;
			}
		};
	}

	render(data) {
		const posted = this.page.date.toISOString().replace(/T.*$/, '');

		return /*html*/`
			${this.renderArchivedNotice(data.tags)}
			${this.renderTags(data.tags)}
			<div class="mb-10 d-flex flex-row flex-grow-1">
				${this.renderReadingTime(data)}
				${this.renderGitHubLink(data)}
			</div>
			<div class="card border mx-0 pb-0 pt-5 mt-0 mb-0">
				${data.content}
			</div>
			<p class="text-muted" role="contentinfo">
				<span class="fa fa-calendar"></span>
				Posted: <time datetime="${posted}">${posted}</time>
			</p>
			`;
	}
};
