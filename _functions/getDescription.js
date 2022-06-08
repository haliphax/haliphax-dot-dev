const htmlEntities = require('./htmlEntities');

const getDescription = (content, limit = 160) => {
	const plain = htmlEntities(content)
		.replace(/<[^>]+>/g, '')
		.replace(/\s{2,}/g, ' ')
		.replace(/\n/g, ' ')
		.trim();

	if (plain.length <= limit) {
		return plain;
	}

	return plain
		.slice(0, limit - 1)
		.replace(/\s+[^ ]*$/, '')
		.replace(/([^ ]) ([^ ]+)$/, '$1&nbsp;$2')
		.replace(/\s+[^ ]*$/, '') + '&nbsp;&hellip;';
};

module.exports = getDescription;
