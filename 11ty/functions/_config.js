const getDescription = require('./getDescription');
const htmlEntities = require('./htmlEntities');
const metaEncode = require('./metaEncode');
const renderCollection = require('./renderCollection');
const renderTags = require('./renderTags');

const config = cfg => {
	cfg.addJavaScriptFunction('getDescription', getDescription);
	cfg.addJavaScriptFunction('htmlEntities', htmlEntities);
	cfg.addJavaScriptFunction('metaEncode', metaEncode);
	cfg.addJavaScriptFunction('renderCollection', renderCollection);
	cfg.addJavaScriptFunction('renderTags', renderTags);
};

module.exports = config;
