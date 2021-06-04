const ignoreTags = require('../ignoreTags');

module.exports = class Post {
	get data() {
		return {
			layout: 'withHeader',
		};
	}

	render(data) {
		const tags = data.tags.filter(t => ignoreTags.indexOf(t) < 0);

		return /*html*/`
			<span class="sr-only">Tags:</span>

			${tags.length == 0 ? '' : /*html*/`
				<ul class="list-unstyled d-inline-block mb-10">
					${tags.map(t => /*html*/`
							<li class="d-inline-block">
								<a href="/tags/${t}/"
									class="badge badge-secondary">
									<span class="fas fa-tag"></span>
									${t}
								</a>
							</li>
						`)
						.join('')}
				</ul>`}

			<div class="card border mx-0 pb-0 pt-5 mt-0">
				${data.content}
			</div>
			`;
	}
};
