module.exports = class SiteMap {
	get data() {
		return {
			permalink: '/sitemap.xml',
			eleventyExcludeFromCollections: true,
		};
	}

	render(data) {
		return /*xml*/`
			<?xml version="1.0" encoding="utf-8"?>
			<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
				${data.collections.all.filter(page => !page.data.draft).map(page => /*xml*/`
					<url>
						<loc>${data.strings.siteRoot}${page.url}</loc>
						<lastmod>${page.date.toISOString()}</lastmod>
						<changefreq>${page.data.changeFreq ? page.data.changeFreq : 'never'}</changefreq>
					</url>
					`).join('')}
			</urlset>
			`.trim();
	}
};
