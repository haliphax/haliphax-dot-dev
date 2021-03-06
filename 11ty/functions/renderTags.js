const ignoreTags = require('../data/ignoreTags');

const renderTags = tags => {
	const filtered = tags.filter(t => ignoreTags.indexOf(t) < 0);

	return /*html*/`
		<span role="contentinfo">
			<span class="sr-only">Tags:</span>
			${filtered.length == 0
				? /*html*/`<span class="sr-only">None.</span>`
				: /*html*/`
					<ul class="list-unstyled d-inline-block mb-10">
						${filtered.map(t => /*html*/`
								<li class="d-inline-block mr-1">
									<a href="/tags/${t}/"
										class="badge badge-secondary">
										<span class="fas fa-tag"></span>
										${t}
									</a>
									&nbsp;
								</li>
							`)
							.join('')}
					</ul>`}
		</span>
		`;
};

module.exports = renderTags;
