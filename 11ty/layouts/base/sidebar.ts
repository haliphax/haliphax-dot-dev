// sidebar management
const wrapper = document.querySelector(".page-wrapper")!;
const media = matchMedia("(min-width:769px)");
const dsh = "data-sidebar-hidden";

const toggle = () =>
	wrapper.getAttribute(dsh)
		? wrapper.removeAttribute(dsh)
		: wrapper.setAttribute(dsh, "true");

media.matches && wrapper.removeAttribute(dsh);
document
	.getElementById("btn-sidebar-toggle")!
	.addEventListener("click", toggle);
document
	.querySelector(".sidebar + .content-wrapper")!
	.addEventListener(
		"click",
		() => media.matches || wrapper.getAttribute(dsh) || toggle(),
	);
