import renderIcon from "./renderIcon";

function renderGitHubLink(data: any) {
	const encodedPath = encodeURIComponent(
		[data.strings.githubRoot, data.page.inputPath.substring(1)].join(""),
	);
	const githubLink = `https://github.com/login?return_to=${encodedPath}`;

	return /*html*/ `
			<small>
				<a href="${githubLink}" class="no-external">
					${renderIcon("edit")}
					Suggest an edit
				</a>
			</small>
			`;
}

export = renderGitHubLink;
