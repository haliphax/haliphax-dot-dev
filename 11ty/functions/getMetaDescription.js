const md = require('../libraries/markdownIt');

function getMetaDescription(data) {
	return this.getDescription(md.render(this.getContent(data)));
}

module.exports = getMetaDescription;
