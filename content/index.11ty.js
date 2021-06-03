module.exports = class Index {
	get data() {
		return {
			layout: 'base',
			title: 'Home',
		};
	}

	render(data) {
		return /*html*/`
			<h2>Recent posts</h2>
			<ul>
				${data.collections.post.reverse().slice(0, 5)
					.map(p => /*html*/`
						<li>
							<a href="${p.url}">${p.data.title}</a>
						</li>
					`).join('\n')}
			</ul>
			`;
	}
};
