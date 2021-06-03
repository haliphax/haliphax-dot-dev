const ignoreTags = require('../_data/ignoreTags');

module.exports = class Post {
	get data() {
		return {
			layout: 'withHeader',
		};
	}

	render(data) {
		return /*html*/`
			<div class="row">
				<div class="col">
					<span class="sr-only">Tags:</span>
					<ul class="list-unstyled d-inline">
						${data.tags.filter(t => ignoreTags.indexOf(t) < 0)
							.map(t => /*html*/`
								<li class="d-inline-block">
									<a href="/tags/${t}/" class="badge badge-primary">
										${t}
									</a>
								</li>
							`).join('')}
					</ul>
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
