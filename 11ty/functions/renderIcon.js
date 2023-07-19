const renderIcon = (icon, classes) => /*html*/`
	<svg class="feather ${classes ?? ''}">
		<use href="/img/feather-sprite.svg#${icon}" />
	</svg>
	`;

module.exports = renderIcon;
