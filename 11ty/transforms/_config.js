const transforms = [
	'htmlMinify',
]

const config = cfg => transforms.map(t => require(`./${t}`)(cfg));

module.exports = config;
