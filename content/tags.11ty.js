const ignoreTags = require('../_data/ignoreTags.js');

module.exports = class Tags {
	get data() {
		return {
			layout: 'withHeader',
			permalink: '/tags/index.html',
			title: 'Tags',
		};
	}

	render(data) {
		const tags = Object.keys(data.collections)
			.filter(t => ignoreTags.indexOf(t) < 0);

		return /*html*/`
			<ul class="list-unstyled">
				${tags.map(t => /*html*/`
					<li class="d-inline-block">
						<a href="/tags/${t}/" class="btn btn-primary">${t}</a>
					</li>
					`).join('')}
			</ul>
			`;
	}
};
