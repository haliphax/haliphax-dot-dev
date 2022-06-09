const htmlMinify = require('./htmlMinify');

const config = cfg => {
	htmlMinify(cfg);
};

module.exports = config;
