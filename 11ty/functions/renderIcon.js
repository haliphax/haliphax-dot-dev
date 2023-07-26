const renderIcon = (icon, classes) => /*html*/`
	<svg class="feather ${classes ?? ''}" aria-hidden="true">
		<use href="/img/feather-sprite.svg#${icon}" />
	</svg>
	`;

module.exports = renderIcon;
