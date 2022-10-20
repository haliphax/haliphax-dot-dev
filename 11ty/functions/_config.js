const getContent = require('./getContent');
const getDescription = require('./getDescription');
const getMetaDescription = require('./getMetaDescription');
const htmlEntities = require('./htmlEntities');
const metaEncode = require('./metaEncode');
const renderArchivedNotice = require('./renderArchivedNotice');
const renderCollection = require('./renderCollection');
const renderReadingTime = require('./renderReadingTime');
const renderTags = require('./renderTags');

const config = cfg => {
	cfg.addJavaScriptFunction('getContent', getContent);
	cfg.addJavaScriptFunction('getDescription', getDescription);
	cfg.addJavaScriptFunction('getMetaDescription', getMetaDescription);
	cfg.addJavaScriptFunction('htmlEntities', htmlEntities);
	cfg.addJavaScriptFunction('metaEncode', metaEncode);
	cfg.addJavaScriptFunction('renderArchivedNotice', renderArchivedNotice);
	cfg.addJavaScriptFunction('renderCollection', renderCollection);
	cfg.addJavaScriptFunction('renderReadingTime', renderReadingTime);
	cfg.addJavaScriptFunction('renderTags', renderTags);
};

module.exports = config;
