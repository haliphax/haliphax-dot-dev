const badTags = [
	'all',
	'post',
];

module.exports = class Tags {
	get data() {
		return {
			layout: 'base',
			permalink: '/tags/index.html',
			title: 'Tags',
		};
	}

	render(data) {
		return /*html*/`
			<h2>Tags</h2>
			<ul>
				${Object.keys(data.collections)
					.filter(k => badTags.indexOf(k) < 0)
					.map(t => /*html*/`
						<li>
							<a href="/tags/${t}/">${t}</a>
						</li>
					`).join('')}
			</ul>
			`;
	}
};
