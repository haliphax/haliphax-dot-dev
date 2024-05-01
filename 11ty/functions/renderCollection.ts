import slugify from "slugify";
import { blurbLength, jumboBlurbLength } from "../data/misc";
import md from "../libraries/markdownIt";
import getDescription from "./getDescription";
import renderIcon from "./renderIcon";
import renderTags from "./renderTags";

const renderCollection = (
	items: any[],
	limit: number | undefined = undefined,
	jumboFirst = false,
) => /*html*/ `
	<ul class="list-unstyled row d-flex flex-row">
		${Array.from(items)
			.filter((p) => p.data.tags?.includes("archived") === false)
			.reverse()
			.slice(0, limit)
			.map((p, i) => {
				const cutoff = jumboFirst && i === 0 ? jumboBlurbLength : blurbLength;
				const slug = slugify(p.url);
				const content = md.render(
					p.template.frontMatter.excerpt || p.template.frontMatter.content,
				);
				const summary = getDescription(content, cutoff);
				const classes = [];
				const jumbo = i === 0 && jumboFirst;

				if (!jumbo) {
					classes.push("col-md-6");
				}

				return /*html*/ `
					<li class="col-12 ${classes.join(" ")} d-flex">
						<div class="card m-5 p-20 w-full ${jumbo ? "border" : ""}">
							<h3 class="card-title mb-0">
								${p.data.title}
							</h3>
							${renderTags(p.data.tags, true)}
							<hr />
							<article aria-labelledby="${slug}">
								<p class="text-muted pb-20">${summary}</p>
							</article>
							<div class="text-right position-absolute bottom-0 right-0 mr-10 mb-10">
								<a href="${p.url}" id="${slug}"
									class="btn btn-secondary d-inline-block">
									${renderIcon("bookmark")}
									<span>
										Read more
										<span class="sr-only">- ${p.data.title}</span>
									</span>
								</a>
							</div>
						</div>
					</li>
					`;
			})
			.join("")}
	</ul>
	`;

export = renderCollection;
