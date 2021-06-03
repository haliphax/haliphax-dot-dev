module.exports = class Tag {
	get data() {
		return {
			eleventyComputed: {
				title({tag}) { return `Tagged: ${tag}`; },
			},
			layout: 'base',
			pagination: {
				addAllPagesToCollections: true,
				alias: 'tag',
				data: 'collections',
				filter: [
					'all',
					'post',
				],
				size: 1,
			},
			permalink({tag}) { return `/tags/${tag}/`; },
		};
	}

	render(data) {
		return /*html*/`
			<h2>Tag: ${data.tag}</h2>
			<ul>
				${data.collections[data.tag].map(t => /*html*/`
					<li>
						<a href="${t.url}">${t.data.title}</a>
					</li>
				`).join('')}
			</ul>
			`;
	}
};
