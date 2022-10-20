const fs = require('fs');
const md = require('../libraries/markdownIt');

const getContent = data => fs.readFileSync(data.page.inputPath, 'utf8')
	.replace(/^(.|\n)+?---\n/m, '')

module.exports = class Post {
	get data() {
		return {
			eleventyComputed: {
				metaDescription(data) {
					return this.getDescription(md.render(getContent(data)))
				},
			},
			layout: 'withHeader',
			ogType: 'page',
		};
	}

	render(data) {
		const reformatted = this.htmlEntities(
			data.content.replace(/<\/?h\d+[^>]*>/ig, x =>
				x.replace(/\d/, d => parseInt(d) + 3)));
		const encodedPath = encodeURIComponent(
			[data.strings.githubRoot, this.page.inputPath.substring(1)].join(''));
		const githubLink = `https://github.com/login?return_to=${encodedPath}`;

		return /*html*/`
			<div class="mb-10 d-flex flex-row flex-grow-1">
				${this.renderReadingTime(data)}
				<small>
					<a href="${githubLink}" class="no-external">
						<i class="fa fa-edit" aria-hidden="true"></i>
						Suggest an edit
					</a>
				</small>
			</div>
			<div class="card border mx-0 pb-0 pt-5 mt-0 mb-0">
				${reformatted}
			</div>
			`;
	}
};
