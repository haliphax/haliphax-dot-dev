/** CSS preload markup */
const preloads =
	[
		'https://fonts.googleapis.com/css2?family=Shrikhand&display=swap',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/fontawesome.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/regular.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/solid.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/brands.min.css',
		'/css/prism-synthwave84.css',
	]
	.map(p => /*html*/`
		<link rel="preload" href="${p}" as="style" onload="this.onload=null;this.rel='stylesheet'">
		<noscript><link rel="stylesheet" href="${p}"></noscript>
	`)
	.join('');

/** generate sidebar link for given object */
const generateSidebarLink = ({ icon, name, url}) => /*html*/`
	<a href="${url}" class="sidebar-link">
		<span class="${icon}"></span>
		${name}
	</a>
	`;


module.exports = class Base {
	async render(data) {
		const twitchData = await this.getTwitchData();
		const ogTitle = this.metaEncode(data.ogTitle ?? data.title);
		const ogAuthor = this.metaEncode(data.ogAuthor ?? data.metaDefaults.author);
		const ogType = data.ogType ?? data.metaDefaults.openGraphType;
		const metaDescription = this.metaEncode(
			data.metaDescription ?? data.metaDefaults.description);
		const metaLabels = [];
		const ogImage = data.metaDefaults.openGraphImageUrl.replace(
			'{title}', encodeURIComponent(data.ogTitle ?? data.title));
		const canonicalUrl = `${data.strings.siteRoot}${this.page.url}`;

		if (data.tags)
			metaLabels.push(["Tags", data.tags.join(', ')]);

		if (data.readingTime)
			metaLabels.push(["Reading time", data.readingTime])

		return /*html*/`
			<!doctype html>
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					${data.robots == undefined ? ''
						: /*html*/`<meta name="robots" content="${data.robots}" />`}
					<title>${data.title} | ${data.strings.siteName}</title>
					<link rel="canonical" href="${canonicalUrl}" />
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
					<meta property="article:published_time" content="${this.page.date.toISOString()}" />
					${data.tags == undefined ? ''
						: data.tags.map(t =>
							/*html*/`<meta property="article:tag" content="${t}" />`)
							.join('')}
					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:creator" content="${data.strings.twitter}" />
					<meta name="twitter:description" content="${metaDescription}" />
					<meta name="twitter:image" content="${ogImage}" />
					<meta name="twitter:site" content="${data.strings.twitter}" />
					<meta name="twitter:title" content="${ogTitle}" />
					${metaLabels.length === 0 ? ''
						: metaLabels.map((v, i) => /*html*/`
							<meta name="twitter:label${i + 1}" content="${v[0]}" />
							<meta name="twitter:data${i + 1}" content="${v[1]}" />
							`).join('')}
					<meta name="generator" content="${data.metaDefaults.generator}" />
					<link rel="icon" href="/img/favicon.gif" />
					<link href="https://cdn.jsdelivr.net/npm/halfmoon@1.1.1/css/halfmoon-variables.min.css" rel="stylesheet" media="screen" />
					<link href="/css/styles.css" rel="stylesheet" />
					${preloads}
				</head>
				<body class="dark-mode">
					<a class="btn btn-primary" id="skip-nav" href="#main-content">
						<span class="fas fa-forward"></span>
						Skip to main content
					</a>
					<div class="page-wrapper with-sidebar"
						data-sidebar-hidden="true"
						data-sidebar-type="overlayed-sm-and-down" >
						<button id="btn-sidebar-toggle" type="button"
							class="btn btn-action position-absolute t-0 l-0 m-5">
							<span class="fa fa-bars"></span>
							<span class="sr-only">Toggle sidebar menu</span>
						</button>
						<div class="sidebar">
							<div class="sidebar-menu">
								<nav class="sidebar-content">
									<h5 class="sidebar-title">${data.strings.siteMenuHeader}</h5>
									<div class="sidebar-divider"></div>
									${data.links.map(generateSidebarLink).join('')}
									<br />
									<h5 class="sidebar-title">${data.strings.socialMenuHeader}</h5>
									<div class="sidebar-divider"></div>
									${data.socials.map(generateSidebarLink).join('')}
								</nav>
							</div>
						</div>
						<div class="content-wrapper">
							<div class="navbar" role="banner">
								<div class="container px-0">
									<div class="navbar-brand w-full">
										<h1 class="text-center w-full">
											<img src="/img/header.png" alt="Magenta skull on purple circuit board logo" class="align-bottom" />
											<a href="/" aria-label="Homepage">${data.strings.header}</a>
										</h1>
									</div>
								</div>
							</div>
							<div class="container px-20 pb-10">
								<main id="main-content" class="pt-10">
									${!twitchData.live ? ''
										: /*html*/`
											<div class="alert alert-primary text-center mb-20" id="twitch-live">
													I'm streaming on Twitch <em><strong>right now</strong></em>.  You should stop by.
													<a href="https://www.twitch.tv/${data.twitch.username}"
														class="btn btn-sm btn-primary ml-10 no-external">
														<span class="fab fa-twitch"></span>
														Let's go!
													</a>
											</div>
											`}
									${data.content}
								</main>
							</div>
						</div>
					</div>
					<script>
						(() => {
							// Sidebar management
							const wrapper = document.querySelector('.page-wrapper');

							if (matchMedia('(min-width:769px)').matches)
								document.querySelector('.page-wrapper')
									.removeAttribute('data-sidebar-hidden');

							document.getElementById('btn-sidebar-toggle')
								.addEventListener('click', e => {
									if (wrapper.getAttribute('data-sidebar-hidden'))
										wrapper.removeAttribute('data-sidebar-hidden');
									else
										wrapper.setAttribute('data-sidebar-hidden', 'true');
								});
						})();
					</script>
				</body>
			</html>
			`;
	}
};
