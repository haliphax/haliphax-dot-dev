const badTags = ['post'];

module.exports = class Post {
	get data() {
		return {
			layout: 'base',
			title: 'haliphax.dev',
		};
	}

	render(data) {
		return /*html*/`
			<h2>${data.title}</h2>
			<ul>
				${data.tags.filter(t => badTags.indexOf(t) < 0)
					.map(t => /*html*/`
						<li>
							<a href="/tags/${t}/">${t}</a>
						</li>
					`).join('')}
			</ul>
			${data.content}
			`;
	}
};
