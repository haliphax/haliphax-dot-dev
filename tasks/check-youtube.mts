import dotenv from "dotenv";
import fs from "fs";
import { diff } from "json-diff";
import { promisify } from "util";
import { ytPlaylistId } from "../11ty/data/misc.js";
import { fileOpts } from "../11ty/misc.js";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

dotenv.config();

const apiKey = process.env.YT_API_KEY;
let cached = null;

try {
	cached = JSON.parse(
		await readFile("11ty/data/external/youtube.json", fileOpts),
	);
} catch (e) {
	//
}

const youtubeData = await fetch(
	`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${ytPlaylistId}&maxResults=3&key=${apiKey}`,
)
	.then((r) => r.json())
	.then(
		(d) =>
			d.items.find((v: any) => v.snippet.title.indexOf(" #shorts") === -1) ??
			null,
	);

if (diff(youtubeData, cached)) {
	console.log("Updating YouTube data...");
	await writeFile(
		"11ty/data/external/youtube.json",
		JSON.stringify(youtubeData),
		fileOpts,
	);
	process.exit(1);
}

process.exit(0);
