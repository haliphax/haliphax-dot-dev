const layouts = [
	'base',
	'page',
	'post',
	'withHeader',
];

const config = cfg =>
	layouts.map(l => cfg.addLayoutAlias(l, `layouts/${l}.11ty.js`));

module.exports = config;
