const handlers = [
	'cssTidy',
];

const config = cfg => handlers.map(h => require(`./${h}`)(cfg));

module.exports = config;
