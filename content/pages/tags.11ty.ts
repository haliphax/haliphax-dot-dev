import renderIcon from "../../11ty/functions/renderIcon";

export = class Tags {
  get data() {
    return {
      changeFreq: "monthly",
      layout: "withHeader",
      metaDescription: "List of all post tags",
      ogType: "website",
      permalink: "/tags/index.html",
      robots: "noindex",
      title: "Tags",
    };
  }

  render(data: any) {
    const tags = Object.keys(data.collections)
      .filter(
        (t) =>
          data.ignoreTags.indexOf(t) < 0 &&
          data.collections[t].some(
            (p: any) => p.data.tags?.includes("archived") === false,
          ),
      )
      .sort((a, b) => a.localeCompare(b));

    return /*html*/ `
			<div class="card border mt-0 mx-0 pt-20 pb-0">
				<ul class="list-unstyled text-center">
					${tags
            .map(
              (t) => /*html*/ `
						<li class="d-inline-block mr-5 mb-10">
							<a href="/tags/${t}/" class="btn btn-secondary">
								${renderIcon("tag")} ${t}
							</a>
						</li>
						`,
            )
            .join("")}
				</ul>
			</div>
			`;
  }
};
