import getContent from "./getContent";
const renderIcon = require("./renderIcon");

const renderReadingTime = async (data: any) => {
	if (!(data.layout == "page" || data.tags.includes("post"))) return null;

	const words = (await getContent(data))
		.replace(/<[^>]*>?|&\w+;/g, "")
		.split(/\n+/)
		.filter((s) => s)
		.map((s) => s.split(/\s+/).length)
		.reduce((p, c) => p + c);
	const wpm = data.misc.readingTimeWpm;
	const readTime = Math.max(1, Math.round(words / wpm));

	return /*html*/ `
		<small class="text-muted flex-fill ai-center">
			${await renderIcon("clock")}
			Reading time: ${readTime} minute${readTime !== 1 ? "s" : ""}
		</small>
		`;
};

export = renderReadingTime;
