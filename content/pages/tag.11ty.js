module.exports = class Tag {
	get data() {
		return {
			eleventyComputed: {
				metaDescription({ tag }) {
					return `Posts tagged with: ${tag}`;
				},
				title({ tag }) {
					return `Tagged: ${tag}`;
				},
			},
			changeFreq: 'monthly',
			layout: 'withHeader',
			ogType: 'website',
			robots: 'noindex',
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
			${this.renderCollection(collections[tag])}
			<p>
				<a href="/tags/">
					<span class="fas fa-tags"></span>
					View all tags
				</a>
			</p>
			`;
	}
};
