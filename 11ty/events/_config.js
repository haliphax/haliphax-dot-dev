const handlers = [
	'cssTidy',
	'iconPurge',
];

const config = cfg => handlers.map(h => require(`./${h}`)(cfg));

module.exports = config;
