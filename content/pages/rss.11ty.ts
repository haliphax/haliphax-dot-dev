export = class RssFeed {
	get data() {
		return {
			permalink: "/rss.xml",
			eleventyExcludeFromCollections: true,
		};
	}

	render(data: any) {
		const now = new Date();
		const isoNow = now.toISOString();

		return /*xml*/ `
			<?xml version="1.0" encoding="utf-8"?>
			<rss version="2.0">
				<channel>
					<title>haliphax.dev</title>
					<description>haliphax.dev site feed</description>
					<link>https://haliphax.dev</link>
					<copyright>${now.getFullYear()} haliphax</copyright>
					<lastBuildDate>${isoNow}</lastBuildDate>
					<pubDate>${isoNow}</pubDate>
					<ttl>1800</ttl>

					${data.collections.post
						.filter(
							(page: any) =>
								!page.data.draft && !page.data.robots?.includes("noindex"),
						)
						.sort((a: any, b: any) => b.date - a.date)
						.map(
							(page: any) => /*xml*/ `
								<item>
									<title>${page.data.title}</title>
									<description><![CDATA[${page.data.metaDescription}]]></description>
									<link>${data.misc.siteRoot}${page.url}</link>
									<pubDate>${page.date.toISOString()}</pubDate>
								</item>
								`,
						)
						.join("")}
				</channel>
			</rss>
			`.trim();
	}
};
