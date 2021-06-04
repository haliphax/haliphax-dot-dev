const renderCollection = require('../_data/renderCollection');

module.exports = class Index {
	get data() {
		return {
			header: 'Recent posts',
			layout: 'withHeader',
			title: 'Home',
		};
	}

	render(data) {
		return /*html*/`
			${renderCollection(data.collections.post, 5)}
			<a href="/tags/">
				<span class="fas fa-tags"></span>
				View all tags
			</a>
			`;
	}
};
