import getContent from "./getContent";
import getDescription from "./getDescription";
import md from "../libraries/markdownIt";

const getMetaDescription = async (data: any) =>
	getDescription(md.render(await getContent(data)));

export = getMetaDescription;
