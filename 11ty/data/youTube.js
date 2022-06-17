const fs = require('fs');

var youTube = null;

try {
	youTube = JSON.parse(fs.readFileSync('youtube.json'), { encoding: 'utf-8' });
}
catch (e) {
	//
}

module.exports = youTube;
