const fs = require('fs');

const getContent = data => fs.readFileSync(data.page.inputPath, 'utf8')
	.replace(/^(.|\n)+?---\n/m, '');

module.exports = getContent
