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
			.filter(t => data.ignoreTags.indexOf(t) < 0);

		return /*html*/`
			<div class="card border mt-0 mx-0 pt-20 pb-0">
				<ul class="list-unstyled">
					${tags.map(t => /*html*/`
						<li class="d-inline-block mr-5 mb-5">
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
