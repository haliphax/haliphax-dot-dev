import getHashRef from "../functions/getHashRef";
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
			<li class="d-block">
				<a href="${opts.url}" class="sidebar-link" ${attrs}>
					<span>${renderIcon(opts.icon)} ${opts.name}</span>
				</a>
			</li>
			`;
	}

	async render(data: any) {
		const hashRef = await getHashRef();
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
		const canonicalUrl = `${data.misc.siteRoot}${data.page.url}`;

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
				<meta name="generator" content="${data.metaDefaults.generator}" />
				<link rel="icon" href="/img/favicon.gif" />
				<link rel="stylesheet" href="/css/styles.min.css?_=${hashRef}" />
				<noscript><style>img[data-src]{display:none}</style></noscript>
				<script defer type="module" src="https://unpkg.com/@zachleat/snow-fall@1.0.1/snow-fall.js"></script>
			</head>
			<body class="dark-mode mh-full h-full">
				<snow-fall></snow-fall>
				<a class="btn btn-primary" id="skip-nav" href="#main-content">
					${renderIcon("fast-forward")}
					Skip to main content
				</a>
				<div class="page-wrapper with-sidebar"
					data-sidebar-hidden="true"
					data-sidebar-type="overlayed-sm-and-down" >
					<button id="btn-sidebar-toggle" type="button"
						class="btn btn-action position-absolute t-0 l-0 m-5">
						<span class="icon-sidebar-o">${renderIcon("menu")}</span>
						<span class="icon-sidebar-x">${renderIcon("x")}</span>
						<span class="sr-only">Toggle sidebar menu</span>
					</button>
					<div class="sidebar">
						<div class="sidebar-menu">
							<nav class="sidebar-content">
								<h5 class="sidebar-title">${data.strings.siteMenuHeader}</h5>
								<div class="sidebar-divider"></div>
								<ul class="list-unstyled d-flex flex-column mb-20">
									${data.links.map(this.generateSidebarLink.bind(this)).join("")}
								</ul>
								<h5 class="sidebar-title">${data.strings.socialMenuHeader}</h5>
								<div class="sidebar-divider"></div>
								<ul class="list-unstyled d-flex flex-column">
									${data.socials.map(this.generateSidebarLink.bind(this)).join("")}
								</ul>
							</nav>
						</div>
					</div>
					<div class="content-wrapper d-flex flex-column">
						<div class="navbar d-flex" role="banner">
							<div class="container px-0">
								<div class="navbar-brand w-full">
									<h1 class="text-center w-full">
										<img
											src="/img/header.gif"
											height="686"
											width="415"
											alt="Magenta skull on purple circuit board logo" class="align-bottom"
										/>
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
					${await inlineScript(
						"11ty/layouts/base/details.js",
						"11ty/layouts/base/lazy.js",
						"11ty/layouts/base/loaded.js",
						"11ty/layouts/base/sidebar.js",
					)}
				</script>
			</body>
		</html>
		`;
	}
};
