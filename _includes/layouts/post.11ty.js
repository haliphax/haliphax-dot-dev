module.exports = class Post {
	get data() {
		return {
			layout: 'withHeader',
		};
	}

	render(data) {
		return /*html*/`
			${this.renderTags(data.tags)}
			<div class="card border mx-0 pb-0 pt-5 mt-0">
				${data.content}
			</div>
			`;
	}
};
