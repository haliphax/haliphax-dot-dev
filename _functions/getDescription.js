const htmlEntities = require('./htmlEntities');

const getDescription = (content) =>
	htmlEntities(content)
		.replace(/<[^>]+>/g, '')
		.replace(/\s{2,}/g, ' ')
		.replace(/\n/g, ' ')
		.slice(0, 159)
		.replace(/\s+[^ ]*$/, '') + ' &hellip;';

module.exports = getDescription;
