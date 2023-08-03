const base64Pixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const renderLazyImage = (html: string) => {
	const swapped = html.replace(
		/(\s|^)src=/ig,
		`$1src="data:image/png;base64,${base64Pixel}" data-src=`
	);

	return /*html*/`${swapped}<noscript>${html}</noscript>`;
};

export = renderLazyImage;
