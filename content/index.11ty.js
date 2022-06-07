module.exports = class Index {
	get data() {
		return {
			changeFreq: 'monthly',
			layout: 'base',
			title: 'Home',
			ogTitle: 'haliphax.dev',
			ogType: 'website',
		};
	}

	async render(data) {
		const vod = (await this.getTwitchData()).latestVod;

		return /*html*/`
			<div class="row d-flex">
				<div class="card m-5 p-20 w-full row">
					<div class="col">
						I am a software developer and
						<a href="https://oddnetwork.org/ascii/">textmode artist</a>. I
						worked as a web developer in higher education for almost 15 years,
						but I have recently moved into the private sector to work with
						microservices and cloud native solutions. I enjoy solving problems
						and sharing what I have learned with others.
					</div>
				</div>
			</div>
			<h2 class="mb-0">
				<span class="fa fa-eye text-primary mr-5"></span>
				Latest stream
			</h2>
			<div class="row d-flex">
				<div class="card m-5 p-20 w-full row">
					<div class="col-12 col-sm-6 col-md-12 col-lg-6" aria-hidden="true">
						<div class="mr-sm-10">
							<a href="${vod.url}" class="no-external">
								<img src="${vod.thumbnail_url}" width="640" height="360"
									class="w-full h-auto border-0" />
							</a>
						</div>
					</div>
					<div class="col-12 col-sm-6 col-md-12 col-lg-6">
						<div class="ml-sm-10">
							<h3 class="card-title mb-5">${vod.title}</h3>
							<hr />
							<p class="text-muted">${vod.description}</p>
							<div class="text-right">
								<a href="${vod.url}"
									class="btn btn-secondary d-inline-block no-external">
									<span class="far fa-eye"></span>
									<span aria-hidden="true">Watch VOD</span>
									<span class="sr-only">Watch VOD: ${vod.title}</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<h2 class="mb-0">
				<span class="fa fa-sticky-note text-primary mr-5"></span>
				Recent posts
			</h2>
			${this.renderCollection(data.collections.post, 6)}
			`;
	}
};
