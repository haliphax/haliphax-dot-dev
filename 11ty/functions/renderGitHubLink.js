function renderGitHubLink(data) {
	const encodedPath = encodeURIComponent(
		[data.strings.githubRoot, this.page.inputPath.substring(1)].join(''));
	const githubLink = `https://github.com/login?return_to=${encodedPath}`;

	return /*html*/`
			<small>
				<a href="${githubLink}" class="no-external">
					<i class="fa fa-edit" aria-hidden="true"></i>
					Suggest an edit
				</a>
			</small>
			`;
}

module.exports = renderGitHubLink;
