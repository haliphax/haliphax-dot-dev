/** CSS preload markup */
const preloads =
	[
		'https://fonts.googleapis.com/css2?family=Shrikhand&display=swap',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/fontawesome.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/regular.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/solid.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/brands.min.css',
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
	render(data) {
		const metaDescription = data.metaDescription
			|| data.metaDefaults.description;

		return /*html*/`
			<!doctype html>
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>${data.title} | haliphax.dev</title>
					<meta name="description" content="${metaDescription}" />
					<link rel="icon" href="data:;base64,iVBORw0KGgo=" />
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
								<div class="sidebar-content">
									<h5 class="sidebar-title">Site</h5>
									<div class="sidebar-divider"></div>
									${data.links.map(d => generateSidebarLink(d)).join('')}
									<br />
									<h5 class="sidebar-title">Social</h5>
									<div class="sidebar-divider"></div>
									${data.socials.map(d => generateSidebarLink(d)).join('')}
								</div>
							</div>
						</div>
						<div class="content-wrapper">
							<nav class="navbar">
								<div class="container px-0">
									<div class="navbar-brand w-full">
										<h1 class="text-center w-full">
											<img src="/img/skull-icon.png" alt="" class="align-bottom" />
											<a href="/" aria-label="Homepage">haliphax</a>
										</h1>
									</div>
								</div>
							</nav>
							<div class="container px-20 pb-10">
								<main id="main-content" class="pt-10">
									<div class="alert alert-primary text-center mb-20 d-none" id="twitch-live">
											I'm streaming on Twitch <em><strong>right now</strong></em>.
											You should stop by.
											<a href="https://twitch.tv/haliphax" class="btn btn-sm btn-primary ml-10 no-external">
												<span class="fab fa-twitch"></span>
												Let's go!
											</a>
									</div>
									${data.content}
								</main>
							</div>
						</div>
					</div>
					<script>
					(function(){
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

						// Twitch live alert
						const root = (window.location.hostname == 'localhost'
							? '' : 'https://api.haliphax.dev');

						fetch(root + '/twitch-live.json')
							.then(r => r.json())
							.then(d => d.live
								&& (document.getElementById('twitch-live').classList
									.remove('d-none')));
					}());
					</script>
				</body>
			</html>
			`;
	}
};
