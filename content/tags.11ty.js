module.exports = class Tags {
	get data() {
		return {
			changeFreq: 'monthly',
			layout: 'withHeader',
			metaDescription: 'List of all post tags',
			ogType: 'website',
			permalink: '/tags/index.html',
			robots: 'noindex',
			title: 'Tags',
		};
	}

	render(data) {
		const tags = Object.keys(data.collections)
			.filter(t => data.ignoreTags.indexOf(t) < 0)
			.sort((a, b) => a.localeCompare(b));

		return /*html*/`
			<div class="card border mt-0 mx-0 pt-20 pb-0">
				<ul class="list-unstyled">
					${tags.map(t => /*html*/`
						<li class="d-inline-block mr-5 mb-10">
							<a href="/tags/${t}/" class="btn btn-secondary">
								<span class="fas fa-tag"></span>
								${t}
							</a>
						</li>
						`).join('')}
				</ul>
			</div>
			`;
	}
};
