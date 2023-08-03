import getMetaDescription from "../functions/getMetaDescription";
import renderGitHubLink from "../functions/renderGitHubLink";
import renderReadingTime from "../functions/renderReadingTime";

export = class Post {
	get data() {
		return {
			eleventyComputed: {
				async metaDescription(data: any) {
					return await getMetaDescription(data);
				},
			},
			layout: 'withHeader',
			ogType: 'website',
		};
	}

	async render(data: any) {
		return /*html*/`
			<div class="mb-10 d-flex flex-row flex-grow-1">
				${await renderReadingTime(data)}
				${renderGitHubLink(data)}
			</div>
			<div class="card border mx-0 pb-0 pt-5 mt-0 mb-0">
				${data.content}
			</div>
			`;
	}
};
