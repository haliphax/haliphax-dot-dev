const libraries = {
	md: 'markdownIt',
}

const config = cfg => Object.entries(libraries)
	.map(l => cfg.setLibrary(l[0], require(`./${l[1]}`)));

module.exports = config;
