// lazy load images
document.addEventListener("DOMContentLoaded", () =>
	Array.from(document.querySelectorAll<HTMLElement>("img[data-src]")).map(
		(i) => ((i as HTMLImageElement).src = i.dataset.src!),
	),
);
