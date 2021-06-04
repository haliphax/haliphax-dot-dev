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
		return renderCollection(data.collections.post, 6);
	}
};
