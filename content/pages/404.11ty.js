module.exports = class FourOhFour {
	get data() {
		return {
			layout: 'withHeader',
			metaDescription: 'The page you were looking for could not be found.',
			ogType: 'website',
			permalink: '404.html',
			robots: 'noindex',
			title: 'Not found',
		};
	}

	render() {
		return /*html*/`<p>The page you were looking for could not be found.</p>`;
	}
};
