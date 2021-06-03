module.exports = class Base {
	render(data) {
		return /*html*/`
			<!doctype html>
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>${data.title} | haliphax.dev</title>
					<link href="https://cdn.jsdelivr.net/npm/halfmoon@1.1.1/css/halfmoon-variables.min.css" rel="stylesheet" />
					<link href="/css/styles.css" rel="stylesheet" />
				</head>
				<body class="dark-mode">
					<div class="container-lg px-10">
						<header>
							<div class="row">
								<div class="col">
									<h1>
										<a href="/" aria-label="Homepage">haliphax.dev</a>
									</h1>
								</div>
							</div>
						</header>
						<main id="main-content">
							${data.content}
						</main>
					</div>
				</body>
			</html>
			`;
	}
};
