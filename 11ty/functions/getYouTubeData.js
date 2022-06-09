const { ytPlaylistId } = require('../data/misc');
const apiKey = process.env.YT_API_KEY;

const getYouTubeData = async () =>
	await fetch(
		`https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${ytPlaylistId}&maxResults=1&key=${apiKey}`)
		.then(r => r.json())
		.then(async d => {
			const videoId = d.items[0].contentDetails.videoId;
			return await fetch(
				`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`)
				.then(r => r.json())
				.then(d => d.items[0]);
		});

module.exports = getYouTubeData;
