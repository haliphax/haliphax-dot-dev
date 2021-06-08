module.exports = class Post {
	get data() {
		return {
			layout: 'withHeader',
			permalink(_) {
				const y = this.page.date.getFullYear(),
					m = this.page.date.getMonth() + 1,
					m0 = m < 10 ? `0${m}` : m,
					d = this.page.date.getDate(),
					d0 = d < 10 ? `0${d}` : d;

				return `/${y}/${m0}/${d0}/${this.page.fileSlug}/`;
			},
		};
	}

	render(data) {
		return /*html*/`
			${this.renderTags(data.tags)}
			<div class="card border mx-0 pb-0 pt-5 mt-0 mb-0">
				${data.content}
			</div>
			<p class="text-muted">
				<span class="fa fa-clock"></span>
				Posted: ${this.page.date.toISOString().replace(/T.*$/, '')}
			</p>
			`;
	}
};
