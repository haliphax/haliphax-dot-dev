module.exports = class Base {
	get data() {
		return {
			layout: 'base',
		};
	}

	render(data) {
		return /*html*/`
			<h2>${data.header || data.title}</h2>
			${data.content}
			`;
	}
};
