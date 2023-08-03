// lazy load images
document.addEventListener("DOMContentLoaded", () =>
  Array.from(document.querySelectorAll("img[data-src]")).map(
    (i) => (i.src = i.dataset.src),
  ),
);
