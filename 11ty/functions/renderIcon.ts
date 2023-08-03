const renderIcon = (icon: string, classes?: string) => /*html*/ `
	<svg class="feather ${classes ?? ""}" aria-hidden="true">
		<use href="/img/feather-sprite.svg#${icon}" />
	</svg>
	`;

export = renderIcon;
