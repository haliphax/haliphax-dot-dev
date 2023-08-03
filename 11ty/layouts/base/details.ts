// <details> fade in/out

// set initial delay to low value to correct for layout bug :(
let delay = 1;

// manage fade-out of details content
Array.from(document.querySelectorAll("summary")).map((s) => {
	const d = s.parentElement! as HTMLDetailsElement;

	const close = () => {
		d.classList.remove("closing");
		s.dataset.close = "";
		d.open = false;
	};

	const click = (e: Event) => {
		if (!d.open) return true;

		if (d.open && s.dataset.close !== "1") {
			setTimeout(close, delay);
			d.classList.add("closing");
			s.dataset.close = "1";
		}

		e.preventDefault();
		return false;
	};

	s.addEventListener("click", click);

	// layout bug fix
	d.classList.add("loading");
	s.click();
	requestAnimationFrame(() => {
		s.click();
		d.classList.remove("loading");
		delay = 500;
	});
});
