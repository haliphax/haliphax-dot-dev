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
		// avoid "hanging" words at end of blurb
		.replace(/([^ ]) ([^ ]+)$/, '$1&nbsp;$2&nbsp;&hellip;');
};

module.exports = getDescription;
