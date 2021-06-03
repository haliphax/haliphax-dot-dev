module.exports = class Base {
	render(data) {
		return /*html*/`
			<!doctype html>
			<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>${data.title} | haliphax.dev</title>
			</head>
			<body>
				<h1>
					<a href="/" aria-label="Homepage">haliphax.dev</a>
				</h1>
				${data.content}
			</body>
			</html>
			`;
	}
};
