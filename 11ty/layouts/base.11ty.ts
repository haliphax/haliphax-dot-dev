import inlineScript from "../functions/inlineScript";
import metaEncode from "../functions/metaEncode";
import renderIcon from "../functions/renderIcon";

export = class Base {
	/** generate sidebar link for given object */
	generateSidebarLink(opts: any) {
		let attrs = "";

		if (opts.hasOwnProperty("attributes")) {
			attrs = Object.entries(opts.attributes)
				.map((v) => `${v[0]}="${v[1]}"`)
				.join("");
		}

		return /*html*/ `
			<a href="${opts.url}" class="sidebar-link" ${attrs}>
				<span>${renderIcon(opts.icon)} ${opts.name}</span>
			</a>
			`;
	}

	async render(data: any) {
		const ogTitle = metaEncode(data.ogTitle ?? data.title);
		const ogAuthor = metaEncode(data.ogAuthor ?? data.metaDefaults.author);
		const ogType = data.ogType ?? data.metaDefaults.openGraphType;
		const metaDescription = metaEncode(
			data.metaDescription ?? data.metaDefaults.description,
		);
		const metaLabels = [];
		const ogImage = data.metaDefaults.openGraphImageUrl.replace(
			"{title}",
			encodeURIComponent(data.ogTitle ?? data.title),
		);
		const canonicalUrl = `${data.strings.siteRoot}${data.page.url}`;

		if (data.tags) metaLabels.push(["Tags", data.tags.join(", ")]);

		if (data.readingTime) metaLabels.push(["Reading time", data.readingTime]);

		const robots = !data.robots
			? ""
			: /*html*/ `<meta name="robots" content="${data.robots}" />`;

		const canonical = data.page.url.endsWith("/404.html")
			? ""
			: /*html*/ `<link rel="canonical" href="${canonicalUrl}" />`;

		const tags =
			data.tags == undefined
				? ""
				: data.tags
						.map(
							(t: string) =>
								/*html*/ `<meta property="article:tag" content="${t}" />`,
						)
						.join("");

		const labels =
			metaLabels.length === 0
				? ""
				: metaLabels
						.map(
							(v, i) => /*html*/ `
								<meta name="twitter:label${i + 1}" content="${v[0]}" />
								<meta name="twitter:data${i + 1}" content="${v[1]}" />
								`,
						)
						.join("");

		const twitchLive = !data.external?.twitch?.live
			? ""
			: /*html*/ `
				<div class="alert alert-primary text-center mb-20" id="twitch-live">
					I'm streaming on Twitch <em><strong>right now</strong></em>.	You should stop by.
					<a href="https://www.twitch.tv/${process.env.TWITCH_USERNAME}"
						class="btn btn-sm btn-primary ml-10 no-external">
						${renderIcon("twitch")}
						Let's go!
					</a>
				</div>
				`;

		return /*html*/ `
		<!doctype html>
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				${robots}
				<title>${data.title} | ${data.strings.siteName}</title>
				${canonical}
				<meta property="og:description" name="description" content="${metaDescription}" />
				<meta property="og:image:alt" content="${ogTitle}" />
				<meta property="og:image:height" content="600" />
				<meta property="og:image:type" content="image/jpeg" />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image" content="${ogImage}" />
				<meta property="og:site_name" content="${data.strings.siteName}" />
				<meta property="og:title" content="${ogTitle}" />
				<meta property="og:type" content="${ogType}" />
				<meta property="og:url" content="${canonicalUrl}" />
				<meta property="article:author" content="${ogAuthor}" />
				<meta property="article:published_time" content="${data.page.date.toISOString()}" />
				${tags}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:creator" content="${data.strings.twitter}" />
				<meta name="twitter:description" content="${metaDescription}" />
				<meta name="twitter:image" content="${ogImage}" />
				<meta name="twitter:site" content="${data.strings.twitter}" />
				<meta name="twitter:title" content="${ogTitle}" />
				${labels}
				<meta name="generator" content="${data.metaDefaults.generator}" />
				<link rel="icon" href="/img/favicon.gif" />
				<link href="/css/styles.min.css" rel="stylesheet" />
				<noscript><style>img[data-src]{display:none}</style></noscript>
			</head>
			<body class="dark-mode mh-full h-full">
				<a class="btn btn-primary" id="skip-nav" href="#main-content">
					${renderIcon("fast-forward")}
					Skip to main content
				</a>
				<div class="page-wrapper with-sidebar"
					data-sidebar-hidden="true"
					data-sidebar-type="overlayed-sm-and-down" >
					<button id="btn-sidebar-toggle" type="button"
						class="btn btn-action position-absolute t-0 l-0 m-5">
						${renderIcon("menu")}
						<span class="sr-only">Toggle sidebar menu</span>
					</button>
					<div class="sidebar">
						<div class="sidebar-menu">
							<nav class="sidebar-content">
								<h5 class="sidebar-title">${data.strings.siteMenuHeader}</h5>
								<div class="sidebar-divider"></div>
								${data.links.map(this.generateSidebarLink.bind(this)).join("")}
								<br />
								<h5 class="sidebar-title">${data.strings.socialMenuHeader}</h5>
								<div class="sidebar-divider"></div>
								${data.socials.map(this.generateSidebarLink.bind(this)).join("")}
							</nav>
						</div>
					</div>
					<div class="content-wrapper d-flex flex-column">
						<div class="navbar d-flex" role="banner">
							<div class="container px-0">
								<div class="navbar-brand w-full">
									<h1 class="text-center w-full">
										<img src="/img/header.gif" alt="Magenta skull on purple circuit board logo" class="align-bottom" />
										<a href="/" aria-label="Homepage">${data.strings.header}</a>
									</h1>
								</div>
							</div>
						</div>
						<div class="container px-20 pb-10">
							<main id="main-content" class="pt-10">
								${twitchLive}
								${data.content}
							</main>
						</div>
					</div>
				</div>
				<script id="scripts">
					${await inlineScript("11ty/layouts/base/details.js")}
					${await inlineScript("11ty/layouts/base/lazy.js")}
					${await inlineScript("11ty/layouts/base/sidebar.js")}
				</script>
			</body>
		</html>
		`;
	}
};
