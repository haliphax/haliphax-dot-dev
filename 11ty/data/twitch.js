const fs = require('fs');

var twitch = null;

try {
	twitch = JSON.parse(fs.readFileSync('twitch.json'), { encoding: 'utf-8' });
}
catch (e) {
	//
}

module.exports = twitch;
