const playlistId = require('../_data/misc').ytPlaylistId;
const apiKey = process.env.YT_API_KEY;

const getYouTubeData = async () =>
	await fetch(
		`https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=1&key=${apiKey}`)
		.then(r => r.json())
		.then(async d => {
			const videoId = d.items[0].contentDetails.videoId;
			return await fetch(
				`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`)
				.then(r => r.json())
				.then(d => d.items[0]);
		});

module.exports = getYouTubeData;
