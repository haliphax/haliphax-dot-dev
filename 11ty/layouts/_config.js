const config = cfg => {
	cfg.addLayoutAlias('base', 'layouts/base.11ty.js');
	cfg.addLayoutAlias('collection', 'layouts/collection.11ty.js');
	cfg.addLayoutAlias('post', 'layouts/post.11ty.js');
	cfg.addLayoutAlias('withHeader', 'layouts/withHeader.11ty.js');
}

module.exports = config;
