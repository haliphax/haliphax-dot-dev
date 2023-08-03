import getMetaDescription from "../functions/getMetaDescription";
import renderArchivedNotice from "../functions/renderArchivedNotice";
import renderGitHubLink from "../functions/renderGitHubLink";
import renderIcon from "../functions/renderIcon";
import renderReadingTime from "../functions/renderReadingTime";
import renderTags from "../functions/renderTags";

export = class Post {
  get data() {
    return {
      eleventyComputed: {
        async metaDescription(data: any) {
          return await getMetaDescription(data);
        },
      },
      layout: "withHeader",
      ogType: "article",
      permalink(data: any) {
        const y = data.page.date.getFullYear(),
          m = data.page.date.getMonth() + 1,
          m0 = m < 10 ? `0${m}` : m;

        return `/${y}/${m0}/${data.page.fileSlug}/`;
      },
    };
  }

  async render(data: any) {
    const posted = data.page.date.toISOString().replace(/T.*$/, "");

    return /*html*/ `
			${renderArchivedNotice(data.tags)}
			${renderTags(data.tags)}
			<div class="mb-10 d-flex flex-row flex-grow-1">
				${await renderReadingTime(data)}
				${renderGitHubLink(data)}
			</div>
			<div class="card border mx-0 pb-0 pt-5 mt-0 mb-0">
				${data.content}
			</div>
			<p class="text-muted" role="contentinfo">
				${renderIcon("calendar")}
				Posted: <time datetime="${posted}">${posted}</time>
			</p>
			`;
  }
};
