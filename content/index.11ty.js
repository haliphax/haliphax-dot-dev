const renderCollection = require('../_data/collection.11ty.js');

module.exports = class Index {
	get data() {
		return {
			header: 'Recent posts',
			layout: 'withHeader',
			myLimit: 3,
			title: 'Home',
		};
	}

	render(data) {
		return /*html*/`
			${renderCollection(data.collections.post)}
			<a href="/tags/">View all tags</a>
			`;
	}
};
