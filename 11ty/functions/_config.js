const functions = [
	'getContent',
	'getDescription',
	'getMetaDescription',
	'htmlEntities',
	'inlineScript',
	'metaEncode',
	'renderArchivedNotice',
	'renderCollection',
	'renderGitHubLink',
	'renderIcon',
	'renderReadingTime',
	'renderTags',
];

const config = cfg =>
	functions.map(s => cfg.addJavaScriptFunction(s, require(`./${s}`)));

module.exports = config;
