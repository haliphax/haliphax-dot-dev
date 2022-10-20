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

		// renumber headers so that lowest possible is h3
		const content = this.htmlEntities(
			data.content.replace(/<\/?h\d+[^>]*>/ig, x =>
				x.replace(/\d/, d => parseInt(d) + 2)));

		return /*html*/`
			<h2 class="${classes.join(' ')}">${data.header || data.title}</h2>
			${content}
			`;
	}
};
