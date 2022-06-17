const markdownIt = require('./markdownIt');

const config = cfg => {
	cfg.setLibrary('md', markdownIt);
}

module.exports = config;
