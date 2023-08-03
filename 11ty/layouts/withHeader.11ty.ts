import htmlEntities from "../functions/htmlEntities";

export = class Base {
  get data() {
    return {
      layout: "base",
    };
  }

  render(data: any) {
    const classes = [];

    if (data.layout == "post") {
      classes.push("mb-10");
    }

    // renumber headers so that lowest possible is h3
    const content = htmlEntities(
      data.content.replace(/<\/?h\d+[^>]*>/gi, (x: string) =>
        x.replace(/\d/, (d: string) => (parseInt(d) + 2).toString()),
      ),
    );

    return /*html*/ `
			<h2 class="${classes.join(" ")}">${data.header || data.title}</h2>
			${content}
			`;
  }
};
