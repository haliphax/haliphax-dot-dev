require('dotenv').config();
const TwitchApi = require('node-twitch').default;

const twitchData = new Promise(async (resolve, reject) => {
	const twitchData = {
		live: false,
		latestVod: {
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

		break;
	}

	resolve(twitchData);
});

const getTwitchData = () => twitchData;

module.exports = getTwitchData;