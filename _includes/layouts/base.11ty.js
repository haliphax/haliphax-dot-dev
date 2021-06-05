const preloads =
	[
		'https://fonts.googleapis.com/css2?family=Shrikhand&display=swap',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/fontawesome.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/regular.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/solid.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/brands.min.css',
	]
	.map(p => /*html*/`
		<link rel="preload" href="${p}" as="style" onload="this.onload=null;this.rel='stylesheet'">
		<noscript><link rel="stylesheet" href="${p}"></noscript>
	`)
	.join('');

module.exports = class Base {
	render(data) {
		return /*html*/`
			<!doctype html>
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>${data.title} | haliphax.dev</title>
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
							class="btn btn-action position-absolute t-0 l-0 m-5"
							onclick="halfmoon.toggleSidebar()">
							<span class="fa fa-bars"></span>
							<span class="sr-only">Toggle sidebar menu</span>
						</button>
						<div class="sidebar">
							<div class="sidebar-menu">
								<div class="sidebar-content">
									<h5 class="sidebar-title">Site</h5>
									<div class="sidebar-divider"></div>
									<a href="/" class="sidebar-link">
										<span class="fa fa-home"></span>
										Homepage
									</a>
									<a href="/tags/" class="sidebar-link">
										<span class="fa fa-tags"></span>
										Tags
									</a>
									<br />
									<h5 class="sidebar-title">Social</h5>
									<div class="sidebar-divider"></div>
									<a href="https://twitch.tv/haliphax" class="sidebar-link">
										<span class="fab fa-twitch"></span>
										Twitch
									</a>
									<a href="https://github.com/haliphax" class="sidebar-link">
										<span class="fab fa-github"></span>
										GitHub
									</a>
									<a href="https://www.youtube.com/channel/UCOl2xKyCvJAyGl-as3VTOeg" class="sidebar-link">
										<span class="fab fa-youtube"></span>
										YouTube
									</a>
									<a href="https://twitter.com/hxdev" class="sidebar-link">
										<span class="fab fa-twitter"></span>
										Twitter
									</a>
								</div>
							</div>
						</div>
						<div class="content-wrapper">
							<nav class="navbar">
								<div class="container px-0">
									<div class="navbar-brand w-full">
										<h1 class="text-center w-full w-md-auto">
											<img src="/img/skull-icon.png" alt="" class="align-bottom" />
											<a href="/" aria-label="Homepage">haliphax</a>
										</h1>
									</div>
								</div>
							</nav>
							<div class="container px-20 pb-10">
								<main id="main-content" class="pt-10">
									<div class="alert alert-primary text-center" id="twitch-live"
										style="display:none">
										<a href="https://twitch.tv/haliphax" class="no-external">
											<span class="fab fa-twitch"></span>
											I'm streaming on Twitch <em>right now</em>.
											Stop by and say hello!
											<span class="fab fa-twitch"></span>
										</a>
									</div>
									${data.content}
								</main>
							</div>
						</div>
					</div>
					<script>if(matchMedia('(min-width:769px)').matches)document.querySelector('.page-wrapper').removeAttribute('data-sidebar-hidden');</script>
					<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/regular.min.js" async></script>
					<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/solid.min.js" async></script>
					<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/brands.min.js" async></script>
					<script src="https://cdn.jsdelivr.net/npm/halfmoon@1.1.1/js/halfmoon.min.js" async></script>
					<script>
					// Twitch live alert
					(function(){
						const root = (window.location.hostname == 'localhost'
							? '' : 'https://api.haliphax.dev');

						fetch(root + '/twitch-live.json')
							.then(r => r.json())
							.then(d => d.live && (document.querySelector('#twitch-live').style = ''));
					}());
					</script>
				</body>
			</html>
			`;
	}
};
