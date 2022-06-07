const metaEncode = text =>
	text.replace(/"/g, '&quot;');

module.exports = metaEncode;
