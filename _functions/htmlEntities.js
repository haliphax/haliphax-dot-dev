module.exports = text =>
	text
		.replace(/--/g, '&ndash;')
		.replace(/\.\.\./g, '&hellip;')
		.replace(/(\W)-&gt;/g, '$1&rArr;');
