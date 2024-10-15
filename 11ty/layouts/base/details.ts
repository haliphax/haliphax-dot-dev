// <details> fade in/out

// set initial delay to low value to correct for layout bug :(
let delay = 1;

// close details
const shut = (d: HTMLDetailsElement, s: HTMLElement) => {
	d.classList.remove("x");
	s.dataset.close = "";
	d.open = false;
};

// handle summary click
const click = (d: HTMLDetailsElement, s: HTMLElement, e: Event) => {
	if (!d.open) return true;

	if (d.open && s.dataset.close !== "1") {
		setTimeout(() => shut(d, s), delay);
		d.classList.add("x");
		s.dataset.close = "1";
	}

	e.preventDefault();
	return false;
};

// manage fade-out of details content on click
Array.from(document.querySelectorAll("summary")).map((s) => {
	const d = s.parentElement! as HTMLDetailsElement;

	s.addEventListener("click", (e: Event) => click(d, s, e));

	// layout bug fix
	d.classList.add("l");
	s.click();
	requestAnimationFrame(() => {
		s.click();
		d.classList.remove("l");
		delay = 500;
	});
});
