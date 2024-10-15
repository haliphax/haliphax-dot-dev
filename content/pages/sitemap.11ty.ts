export = class SiteMap {
	get data() {
		return {
			permalink: "/sitemap.xml",
			eleventyExcludeFromCollections: true,
		};
	}

	render(data: any) {
		return /*xml*/ `
			<?xml version="1.0" encoding="utf-8"?>
			<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				${data.collections.all
					.filter(
						(page: any) =>
							!page.data.draft && !page.data.robots?.includes("noindex"),
					)
					.map(
						(page: any) => /*xml*/ `
							<url>
								<loc>${data.misc.siteRoot}${page.url}</loc>
								<lastmod>${page.date.toISOString()}</lastmod>
								<changefreq>${page.data.changeFreq ?? "never"}</changefreq>
							</url>
							`,
					)
					.join("")}
			</urlset>
			`.trim();
	}
};
