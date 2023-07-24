const renderLazyImage = html => /*html*/`
	${html.replace(/(\s|^)src=/ig, '$1data-src=')}
	<noscript>${html}</noscript>
`;

module.exports = renderLazyImage;
