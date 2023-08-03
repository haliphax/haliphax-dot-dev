import htmlEntities from "./htmlEntities";

const getDescription = (content?: string, limit = 160) => {
	if (!content) {
		return;
	}

	const plain = htmlEntities(content)
		.replace(/<[^>]+>/g, "")
		.replace(/\s{2,}/g, " ")
		.replace(/\n/g, " ")
		.trim();

	if (plain.length <= limit) {
		return plain;
	}

	return (
		plain
			.slice(0, limit - 1)
			.replace(/\s+[^ ]*$/, "")
			// avoid "hanging" words at end of blurb
			.replace(/([^ ]) ([^ ]+)$/, "$1&nbsp;$2&nbsp;&hellip;")
	);
};

export = getDescription;
