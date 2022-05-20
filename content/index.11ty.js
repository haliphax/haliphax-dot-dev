module.exports = class Index {
	get data() {
		return {
			changefreq: 'monthly',
			header: 'Recent posts',
			layout: 'withHeader',
			title: 'Home',
			ogTitle: 'haliphax.dev',
			ogType: 'website',
		};
	}

	render(data) {
		return this.renderCollection(data.collections.post, 6);
	}
};
