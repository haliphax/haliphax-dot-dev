module.exports = class FourOhFour {
	get data() {
		return {
			permalink: '404.html',
			layout: 'base',
			title: 'Not found',
		};
	}

	render(data) {
		return /*html*/`
			<h2>Not found</h2>
			<p>The page you were looking for could not be found.</p>
			`;
	}
};
