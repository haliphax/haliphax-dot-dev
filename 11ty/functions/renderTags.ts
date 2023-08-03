import ignoreTags from "../data/ignoreTags";
import renderIcon from "./renderIcon";

const renderTags = (tags: string[], inline = false) => {
	const filtered = tags.filter((t) => ignoreTags.indexOf(t) < 0);

	return inline
		? /*html*/ `
			<span role="contentinfo">
				<span class="sr-only">Tags:</span>
				${renderIcon("tag", "text-secondary mr-5")}
				<ul class="list-unstyled d-inline mb-5">
				${filtered
					.map(
						(t) => /*html*/ `
							<li class="d-inline-block">
								<a href="/tags/${t}/" class="text-secondary">${t}</a>
								&nbsp;
							</li>
							`,
					)
					.join("")}
				</ul>
			</span>
			`
		: /*html*/ `
			<span role="contentinfo">
				<span class="sr-only">Tags:</span>
				${
					filtered.length == 0
						? /*html*/ `<span class="sr-only">None.</span>`
						: /*html*/ `
						<ul class="list-unstyled d-inline-block mb-10">
							${filtered
								.map(
									(t) => /*html*/ `
									<li class="d-inline-block mr-1">
										<a href="/tags/${t}/"
											class="badge badge-secondary">
											${renderIcon("tag")}
											${t}
										</a>
										&nbsp;
									</li>
									`,
								)
								.join("")}
						</ul>`
				}
			</span>
			`;
};

export = renderTags;
