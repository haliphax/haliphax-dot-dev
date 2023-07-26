const ignoreTags = require('../data/ignoreTags');
const renderIcon = require('./renderIcon');

const renderTags = (tags, inline = false) => {
	const filtered = tags.filter(t => ignoreTags.indexOf(t) < 0);

	return inline
		? /*html*/`
			<small role="contentinfo">
				<span class="sr-only">Tags:</span>
				${renderIcon('tag', 'text-secondary')}
				<ul class="list-unstyled d-inline mb-5">
				${tags.map(t => /*html*/`
					<li class="d-inline-block ml-5">
						<a href="/tags/${t}/" class="text-secondary">${t}</a>
					</li>
				`)}
				</ul>
			</small>
			`
		: /*html*/`
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
											${renderIcon('tag')}
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
