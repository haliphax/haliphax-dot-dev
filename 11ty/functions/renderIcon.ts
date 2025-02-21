import getHashRef from "./getHashRef";

const renderIcon = async (icon: string, classes?: string) => /*html*/ `
	<svg
		class="feather ${classes ?? ""}"
		aria-hidden="true"
		height="24"
		width="24"
	>
		<use href="/img/feather-sprite.svg?_=${await getHashRef()}#${icon}" />
	</svg>
	`;

export = renderIcon;
