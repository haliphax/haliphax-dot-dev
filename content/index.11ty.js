module.exports = class Index {
	get data() {
		return {
			header: 'Recent posts',
			layout: 'withHeader',
			title: 'Home',
		};
	}

	render(data) {
		return this.renderCollection(data.collections.post, 6);
	}
};
