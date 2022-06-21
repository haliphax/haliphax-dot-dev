import dotenv from 'dotenv';
import fs from 'fs';
import { diff } from 'json-diff';
import pkg from '../11ty/data/misc.js';
const { ytPlaylistId } = pkg;

dotenv.config();

const apiKey = process.env.YT_API_KEY;
var cached = null;

try {
	cached = JSON.parse(
		fs.readFileSync('11ty/data/external/youtube.json', { encoding: 'utf-8' }));
}
catch (e) {
	//
}

const youtubeData = await fetch(
	`https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${ytPlaylistId}&maxResults=1&key=${apiKey}`)
	.then(r => r.json())
	.then(async d => {
		const videoId = d.items[0].contentDetails.videoId;
		return await fetch(
			`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`)
			.then(r => r.json())
			.then(d => d.items[0]);
	});

if (diff(youtubeData, cached)) {
	console.log('Updating YouTube data...');
	fs.writeFileSync(
		'11ty/data/external/youtube.json',
		JSON.stringify(youtubeData));
	process.exit(1);
}

process.exit(0);
