import dotenv from "dotenv";
import * as fs from "fs";
import { diff } from "json-diff";
import { TwitchApi } from "node-twitch";
import { promisify } from "util";
import misc from "../11ty/misc.js";
const { fileOpts } = misc;

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

dotenv.config();

var cached = null;

try {
	cached = JSON.parse(
		await readFile("11ty/data/external/twitch.json", fileOpts),
	);
} catch (e) {
	//
}

interface TwitchData {
	live: boolean;
	latestVod: any | null;
}

const twitchData: TwitchData = {
	live: false,
	latestVod: null,
};

/* Twitch API jiggery-pokery */
const api = new TwitchApi({
	client_id: process.env.TWITCH_CLIENT_ID!,
	client_secret: process.env.TWITCH_CLIENT_SECRET!,
});

const userId = (await api.getUsers(process.env.TWITCH_USERNAME!)).data[0].id;
const streams = (
	await api.getStreams({ channel: process.env.TWITCH_USERNAME! })
).data.length;

if (streams > 0) {
	twitchData.live = true;
}

const vods = (await api.getVideos({ first: 2, user_id: userId })).data;

for (let vod of vods) {
	// expired VOD; don't bother going further
	if (!vod.thumbnail_url) {
		break;
	}

	// VOD of live stream; skip it
	if (!vod.thumbnail_url.length) {
		continue;
	}

	twitchData.latestVod = vod;
	twitchData.latestVod.thumbnail_url = vod.thumbnail_url
		.replace("%{width}", "640")
		.replace("%{height}", "360");
	twitchData.latestVod.view_count = 0;

	break;
}

if (diff(twitchData, cached)) {
	console.log("Updating Twitch data...");
	await writeFile(
		"11ty/data/external/twitch.json",
		JSON.stringify(twitchData),
		fileOpts,
	);
	process.exit(1);
}

process.exit(0);
