import dotenv from 'dotenv';
import fs from 'fs';
import { diff } from 'json-diff';
import twitch from 'node-twitch';

const TwitchApi = twitch.default;
dotenv.config();

var cached = null;

try {
	cached = JSON.parse(
		fs.readFileSync('11ty/data/external/twitch.json', { encoding: 'utf-8' }));
}
catch (e) {
	//
}

const twitchData = {
	live: false,
	latestVod: {
		id: null,
		image: null,
		title: null,
		description: null,
	},
};

/* Twitch API jiggery-pokery */
const api = new TwitchApi({
	client_id: process.env.TWITCH_CLIENT_ID,
	client_secret: process.env.TWITCH_CLIENT_SECRET,
});

const userId = (await api.getUsers(process.env.TWITCH_USERNAME)).data[0].id;
const streams =
	(await api.getStreams({ user_login: process.env.TWITCH_USERNAME }))
		.data.length;

if (streams > 0) {
	twitchData.live = true;
}

const vods = (await api.getVideos({ first: 2, user_id: userId })).data;

for (let vod of vods) {
	// VOD of live stream; skip it
	if (!vod.thumbnail_url.length) {
		continue;
	}

	twitchData.latestVod = vod;
	twitchData.latestVod.thumbnail_url = vod.thumbnail_url
		.replace('%{width}', '640')
		.replace('%{height}', '360');
	twitchData.latestVod.view_count = null;

	break;
}

if (diff(twitchData, cached)) {
	console.log('Updating Twitch data...');
	fs.writeFileSync(
		'11ty/data/external/twitch.json',
		JSON.stringify(twitchData));
	process.exit(1);
}

process.exit(0);
