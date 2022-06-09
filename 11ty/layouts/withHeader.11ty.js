module.exports = class Base {
	get data() {
		return {
			layout: 'base',
		};
	}

	render(data) {
		const classes = [];

		if (data.layout == 'post') {
			classes.push('mb-0');
		}

		return /*html*/`
			<h2 class="${classes.join(' ')}">${data.header || data.title}</h2>
			${data.content}
			`;
	}
};
