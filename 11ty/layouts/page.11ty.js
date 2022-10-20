module.exports = class Post {
	get data() {
		return {
			eleventyComputed: {
				metaDescription(data) {
					return this.getMetaDescription(data);
				},
			},
			layout: 'withHeader',
			ogType: 'website',
		};
	}

	render(data) {
		return /*html*/`
			<div class="mb-10 d-flex flex-row flex-grow-1">
				${this.renderReadingTime(data)}
				${this.renderGitHubLink(data)}
			</div>
			<div class="card border mx-0 pb-0 pt-5 mt-0 mb-0">
				${data.content}
			</div>
			`;
	}
};
