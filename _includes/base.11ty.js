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
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link href="https://fonts.googleapis.com/css2?family=Shrikhand&display=swap" rel="stylesheet" />
					<link href="https://cdn.jsdelivr.net/npm/halfmoon@1.1.1/css/halfmoon-variables.min.css" rel="stylesheet" />
					<link href="/css/styles.css" rel="stylesheet" />
					<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/fontawesome.min.css" rel="stylesheet" />
					<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/regular.min.css" rel="stylesheet" />
					<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/solid.min.css" rel="stylesheet" />
					<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/regular.min.js" async></script>
					<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/solid.min.js" async></script>
				</head>
				<body class="dark-mode">
					<a class="btn btn-primary" id="skip-nav" href="#main-content">
						<span class="fas fa-forward"></span>
						Skip to main content
					</a>
					<div class="page-wrapper with-navbar">
						<nav class="navbar">
							<div class="container-md px-0">
								<div class="navbar-brand w-full">
									<h1 class="text-center w-full w-md-auto">
										<img src="/img/skull-icon.png" alt="" class="align-bottom" />
										<a href="/" aria-label="Homepage">haliphax</a>
									</h1>
								</div>
							</div>
						</nav>
						<div class="content-wrapper">
							<div class="container-md">
								<main id="main-content" class="px-10 pt-10">
									${data.content}
								</main>
							</div>
						</div>
					</div>
				</body>
			</html>
			`;
	}
};
