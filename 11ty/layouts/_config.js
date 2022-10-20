const config = cfg => {
	cfg.addLayoutAlias('base', 'layouts/base.11ty.js');
	cfg.addLayoutAlias('page', 'layouts/page.11ty.js');
	cfg.addLayoutAlias('post', 'layouts/post.11ty.js');
	cfg.addLayoutAlias('withHeader', 'layouts/withHeader.11ty.js');
}

module.exports = config;
