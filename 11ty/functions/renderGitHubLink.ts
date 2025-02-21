import renderIcon from "./renderIcon";

async function renderGitHubLink(data: any) {
	const encodedPath = encodeURIComponent(
		[data.misc.githubRoot, data.page.inputPath.substring(1)].join(""),
	);
	const githubLink = `https://github.com/login?return_to=${encodedPath}`;

	return /*html*/ `
			<small>
				<a href="${githubLink}" class="no-external">
					${await renderIcon("edit")}
					Suggest a change
				</a>
			</small>
			`;
}

export = renderGitHubLink;
