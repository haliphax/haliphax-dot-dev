module.exports = class Index {
	get data() {
		return {
			changeFreq: 'weekly',
			layout: 'base',
			ogTitle: 'haliphax.dev',
			ogType: 'website',
			permalink: '/index.html',
			title: 'Home',
		};
	}

	render(data) {
		const vod = data.external.twitch?.latestVod;
		const vodDescription =
			this.getDescription(vod?.description, data.misc.blurbLength);
		const yt = data.external.youtube;
		const ytDescription =
			this.getDescription(yt?.snippet.description, data.misc.blurbLength);

		return /*html*/`
			<div class="row d-flex">
				<details class="intro card m-5 py-5 px-20 w-full row">
					<summary class="w-full">About me</summary>
					<div class="col">
						<hr />
						I am a software engineer and
						<a href="https://oddnetwork.org/ascii/">textmode artist</a>. I
						worked as a web developer in higher education for almost 15 years,
						but I have recently moved into the private sector to build
						microservices and cloud-native solutions. I enjoy solving problems
						and sharing what I have learned with others.
					</div>
				</details>
			</div>
			${!vod.url ? '' : /*html*/`
				<h2 class="mb-0">
					<span class="fa fa-eye text-primary mr-5"></span>
					Latest stream
				</h2>
				<div class="row d-flex">
					<div class="card m-5 p-20 w-full row">
						<div class="col-12 col-sm-6 col-md-12 col-lg-6" aria-hidden="true">
							<div class="mr-sm-10">
								<a href="${vod.url}" class="no-external img-wrap mb-5">
									<img src="${vod.thumbnail_url}" width="640" height="360"
										class="w-full h-auto border-0" alt="Video thumbnail" />
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
								<span class="far fa-eye"></span>
								<span aria-hidden="true">Watch VOD</span>
								<span class="sr-only">Watch VOD: ${vod.title}</span>
							</a>
						</div>
					</div>
				</div>
				`}
			${!yt ? '' : /*html*/`
				<h2 class="mb-0">
					<span class="fa fa-play text-primary mr-5"></span>
					Latest video
				</h2>
				<div class="row d-flex">
					<div class="card m-5 p-20 w-full row">
						<div class="col-12 col-sm-6 col-md-12 col-lg-6" aria-hidden="true">
							<div class="mr-sm-10">
								<a href="https://youtu.be/${yt.snippet.resourceId.videoId}" class="no-external img-wrap mb-5">
									<img src="${yt.snippet.thumbnails.standard.url}" width="1280" height="720"
										class="w-full h-auto border-0 yt-thumbnail" alt="Video thumbnail" />
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
								<span class="fa fa-play"></span>
								<span aria-hidden="true">Watch video</span>
								<span class="sr-only">Watch video: ${yt.snippet.title}</span>
							</a>
						</div>
					</div>
				</div>
				`}
			<h2 class="mb-0">
				<span class="fa fa-sticky-note text-primary mr-5"></span>
				Recent posts
			</h2>
			${this.renderCollection(data.collections.post, 3, true)}
			`;
	}
};
