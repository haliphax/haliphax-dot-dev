const renderCollection = require('../_includes/renderCollection');

module.exports = class Tag {
	get data() {
		return {
			eleventyComputed: {
				title({ tag }) {
					return `Tagged: ${tag}`;
				},
			},
			layout: 'withHeader',
			pagination: {
				addAllPagesToCollections: true,
				alias: 'tag',
				data: 'collections',
				size: 1,
			},
			permalink({ tag }) {
				return `/tags/${tag}/`;
			},
		};
	}

	render({ collections, tag }) {
		return /*html*/`
			${renderCollection(collections[tag])}
			<a href="/tags/">
				<span class="fas fa-tags"></span>
				View all tags
			</a>
			`;
	}
};
