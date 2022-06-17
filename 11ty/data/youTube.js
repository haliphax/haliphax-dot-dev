const fs = require('fs');

var youTube = null;

try {
	youTube = JSON.parse(fs.readFileSync('youtube.json'));
}
catch (e) {
	//
}

module.exports = youTube;
