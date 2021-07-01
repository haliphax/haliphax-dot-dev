module.exports = (text) =>
	text
		.replace(/--/g, '&ndash;')
		.replace(/\.\.\./g, '&hellip;');
