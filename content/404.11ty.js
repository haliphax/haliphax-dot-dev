module.exports = class FourOhFour {
	get data() {
		return {
			permalink: '404.html',
			layout: 'withHeader',
			title: 'Not found',
		};
	}

	render(data) {
		return /*html*/`
			<p>The page you were looking for could not be found.</p>
			`;
	}
};
