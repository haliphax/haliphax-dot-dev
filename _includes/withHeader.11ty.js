module.exports = class Base {
	get data() {
		return {
			layout: 'base',
		};
	}

	render(data) {
		return /*html*/`
			<div class="row">
				<div class="col">
					<h2>${data.header || data.title}</h2>
				</div>
			</div>
			<div class="row">
				<div class="col">
					${data.content}
				</div>
			</div>
			`;
	}
};
