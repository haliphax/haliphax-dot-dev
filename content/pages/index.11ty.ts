import getDescription from "../../11ty/functions/getDescription";
import renderCollection from "../../11ty/functions/renderCollection";
import renderIcon from "../../11ty/functions/renderIcon";
import renderLazyImage from "../../11ty/functions/renderLazyImage";

export = class Index {
	get data() {
		return {
			changeFreq: "weekly",
			layout: "base",
			ogTitle: "haliphax.dev",
			ogType: "website",
			permalink: "/index.html",
			title: "Home",
		};
	}

	async render(data: any) {
		const vod = data.external?.twitch?.latestVod;
		const vodDescription = getDescription(
			vod?.description,
			data.misc.blurbLength,
		);
		const yt = data.external?.youtube;
		const ytDescription = getDescription(
			yt?.snippet.description,
			data.misc.blurbLength,
		);

		return /*html*/ `
			<div class="row d-flex">
				<details class="intro card m-5 py-5 px-20 w-full row">
					<summary class="w-full">About me</summary>
					<div class="col">
						<hr />
						${data.strings.aboutMe}
					</div>
				</details>
			</div>
			<h2 class="mb-0">
				<span class="text-primary mr-5">${await renderIcon("book-open")}</span>
				Recent posts
			</h2>
			${await renderCollection(data.collections.post, 3, true)}
			${
				!vod?.url
					? ""
					: /*html*/ `
						<h2 class="mb-0">
							<span class="text-primary mr-5">${await renderIcon("tv")}</span>
							Latest stream
						</h2>
						<div class="row d-flex">
							<div class="card m-5 p-20 w-full row">
								<div class="col-12 col-sm-6 col-md-12 col-lg-6 thumbnail" aria-hidden="true">
									<div class="mr-sm-10">
										<a href="${vod?.url}" class="no-external img-wrap mb-5">
											${renderLazyImage(/*html*/ `
												<img src="${vod.thumbnail_url}" width="640"
													height="360" class="w-full h-auto border-0"
													alt="Video thumbnail" />
												`)}
										</a>
									</div>
								</div>
								<div class="col-12 col-sm-6 col-md-12 col-lg-6">
									<div class="ml-sm-10">
										<h3 class="card-title mb-5">${vod.title}</h3>
										<hr />
										<p class="text-muted pb-20">${vodDescription}</p>
									</div>
								</div>
								<div class="text-right position-absolute bottom-0 right-0 mr-10 mb-10">
									<a href="${vod.url}"
										class="btn btn-secondary d-inline-block no-external">
										${await renderIcon("play")}
										<span>
											Watch VOD
											<span class="sr-only">- ${vod.title}</span>
										</span>
									</a>
								</div>
							</div>
						</div>
						`
			}
			${
				!yt
					? ""
					: /*html*/ `
						<h2 class="mb-0">
							<span class="text-primary mr-5">${await renderIcon("film")}</span>
							Latest video
						</h2>
						<div class="row d-flex">
							<div class="card m-5 p-20 w-full row">
								<div class="col-12 col-sm-6 col-md-12 col-lg-6 thumbnail" aria-hidden="true">
									<div class="mr-sm-10">
										<a href="https://youtu.be/${
											yt.snippet.resourceId.videoId
										}" class="no-external img-wrap mb-5">
											${renderLazyImage(/*html*/ `
												<img src="${yt.snippet.thumbnails.standard.url}"
													width="1280" height="720" alt="Video thumbnail"
													class="w-full h-auto border-0 yt-thumbnail" />
												`)}
										</a>
									</div>
								</div>
								<div class="col-12 col-sm-6 col-md-12 col-lg-6">
									<div class="ml-sm-10">
										<h3 class="card-title mb-5">${yt.snippet.title}</h3>
										<hr />
										<p class="text-muted pb-20">${ytDescription}</p>
									</div>
								</div>
								<div class="text-right position-absolute bottom-0 right-0 mr-10 mb-10">
									<a href="https://youtu.be/${yt.snippet.resourceId.videoId}"
										class="btn btn-secondary d-inline-block no-external">
										${await renderIcon("play")}
										<span>
											Watch video
											<span class="sr-only">- ${yt.snippet.title}</span>
										</span>
									</a>
								</div>
							</div>
						</div>
						`
			}
			`;
	}
};
