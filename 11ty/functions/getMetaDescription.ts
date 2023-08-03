import md from "../libraries/markdownIt";
import getContent from "./getContent";
import getDescription from "./getDescription";

const getMetaDescription = async (data: any) =>
	getDescription(md.render(await getContent(data)));

export = getMetaDescription;
