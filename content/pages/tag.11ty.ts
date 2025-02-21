import renderCollection from "../../11ty/functions/renderCollection";
import renderIcon from "../../11ty/functions/renderIcon";

export = class Tag {
	get data() {
		return {
			eleventyComputed: {
				metaDescription({ tag }: { tag: string }) {
					return `Posts tagged with: ${tag}`;
				},
				title({ tag }: { tag: string }) {
					return `Tagged: ${tag}`;
				},
			},
			changeFreq: "monthly",
			layout: "withHeader",
			ogType: "website",
			robots: "noindex",
			pagination: {
				addAllPagesToCollections: true,
				alias: "tag",
				data: "collections",
				size: 1,
			},
			permalink({ tag }: { tag: string }) {
				return `/tags/${tag}/`;
			},
		};
	}

	async render({
		collections,
		tag,
	}: {
		collections: { [key: string]: any };
		tag: string;
	}) {
		return /*html*/ `
			${await renderCollection(collections[tag])}
			<p>
				<a href="/tags/">
					${await renderIcon("tag")} View all tags
				</a>
			</p>
			`;
	}
};
