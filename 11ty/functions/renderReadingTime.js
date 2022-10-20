function renderReadingTime(data) {
	if (!(data.layout == 'page' || data.tags.includes('post')))
		return null;

	const words = this.getContent(data)
		.replace(/<[^>]*>|&\w+;/ig, '')
		.split(/\n+/)
		.filter(s => s)
		.map(s => s.split(/\s+/).length)
		.reduce((p, c) => p + c)
	const wpm = data.misc.readingTimeWpm;
	const readTime = Math.max(1, Math.round(words / wpm));

	return /*html*/`
		<small class="text-muted flex-fill ai-center">
			<i class="fa fa-clock" aria-hidden="true">&nbsp;</i>
			Reading time: ${readTime} minute${readTime !== 1 ? 's' : ''}
		</small>
		`;
}

module.exports = renderReadingTime;
