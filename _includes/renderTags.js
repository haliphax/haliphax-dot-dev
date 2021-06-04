const ignoreTags = require('./ignoreTags');

module.exports = (tags) => {
		const filtered = tags.filter(t => ignoreTags.indexOf(t) < 0);

		return /*html*/`
			<span class="sr-only">Tags:</span>

			${filtered.length == 0
				? /*html*/`<span class="sr-only">None.</span>`
				: /*html*/`
					<ul class="list-unstyled d-inline-block mb-10">
						${filtered.map(t => /*html*/`
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
			`;
};
