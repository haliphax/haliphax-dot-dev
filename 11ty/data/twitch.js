const fs = require('fs');

var twitch = null;

try {
	twitch = JSON.parse(fs.readFileSync('twitch.json'));
}
catch (e) {
	//
}

module.exports = twitch;
