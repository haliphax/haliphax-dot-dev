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
		const reformatted = this.htmlEntities(
			data.content.replace(/<\/?h\d+[^>]*>/ig, x =>
				x.replace(/\d/, d => parseInt(d) + 3)));
		const posted = this.page.date.toISOString().replace(/T.*$/, '');
		const encodedPath = encodeURIComponent(
			[data.strings.githubRoot, this.page.inputPath.substring(1)].join(''));
		const githubLink = `https://github.com/login?return_to=${encodedPath}`;

		return /*html*/`
			${this.renderArchivedNotice(data.tags)}
			${this.renderTags(data.tags)}
			<div class="mb-10 d-flex flex-row flex-grow-1">
				${this.renderReadingTime(data)}
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
