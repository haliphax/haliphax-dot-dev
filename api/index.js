require('dotenv').config();
const fetch = require('node-fetch');
const jsonDiff = require('json-diff');
const TwitchApi = require('node-twitch').default;

const main = async () => {
	console.log('💬 Connecting to Twitch API');

	const api = new TwitchApi({
		client_id: process.env.TWITCH_CLIENT_ID,
		client_secret: process.env.TWITCH_CLIENT_SECRET,
	});

	console.log('❓ Querying API for stream data');

	const apiResponse = await api.getStreams(
		{ channels: [process.env.TWITCH_USERNAME] });
	const apiResult = { live: apiResponse.data.length > 0 };

	console.log('❓ Querying jsonbin.org for stored data');

	const storedResult = await fetch(process.env.JSONBIN_URL, {
		headers: { authorization: `token ${process.env.JSONBIN_TOKEN}` }})
		.then(r => r.json());

	if (jsonDiff.diff(apiResult, storedResult)) {
		console.log('💾 Posting new data to jsonbin.org')

		await fetch(process.env.JSONBIN_URL, {
			body: JSON.stringify(apiResult),
			headers: { authorization: `token ${process.env.JSONBIN_TOKEN}` },
			method: 'PUT',
		})
		.then(() => console.log('✅ Status updated', apiResult));
	}
	else {
		console.log('🤷 No change');
	}
};

main();
