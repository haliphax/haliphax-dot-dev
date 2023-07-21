// sidebar management
const wrapper = document.querySelector('.page-wrapper');
const dsh = 'data-sidebar-hidden';

matchMedia('(min-width:769px)').matches
	&& wrapper.removeAttribute(dsh);

document.getElementById('btn-sidebar-toggle')
	.addEventListener('click', () =>
		wrapper.getAttribute(dsh)
			? wrapper.removeAttribute(dsh)
			: wrapper.setAttribute(dsh, 'true'));
