import ignoreTags from "../data/ignoreTags";
import renderIcon from "./renderIcon";

const renderTags = async (tags: string[], inline = false) => {
	const filtered = tags.filter((t) => ignoreTags.indexOf(t) < 0);

	return inline
		? /*html*/ `
			<span role="contentinfo">
				${await renderIcon("tag", "text-secondary mr-5")}
				<span class="sr-only">Tags:</span>
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
							${(
								await Promise.all(
									filtered.map(
										async (t) => /*html*/ `
									<li class="d-inline-block mr-1">
										<a href="/tags/${t}/"
											class="badge badge-secondary">
											${await renderIcon("tag")}
											${t}
										</a>
										&nbsp;
									</li>
									`,
									),
								)
							).join("")}
						</ul>`
				}
			</span>
			`;
};

export = renderTags;
