// sidebar management
const wrapper = document.querySelector(".page-wrapper")!;
const media = matchMedia("(min-width:769px)");
const dsh = "data-sidebar-hidden";

const toggle = () =>
	wrapper.getAttribute(dsh)
		? wrapper.removeAttribute(dsh)
		: wrapper.setAttribute(dsh, "true");

if (!media.matches) wrapper.setAttribute(dsh, "true");

const placeholder = document.createElement("span");
const template = document.getElementById("tp-btn-sidebar-toggle")!;

placeholder.innerHTML = template.innerHTML;

const button = placeholder.querySelector("button")!;

template.replaceWith(button);
button.addEventListener("click", toggle);
document
	.querySelector(".sidebar + .content-wrapper")!
	.addEventListener(
		"click",
		() => media.matches || wrapper.getAttribute(dsh) || toggle(),
	);
