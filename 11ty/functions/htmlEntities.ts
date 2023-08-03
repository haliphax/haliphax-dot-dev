const htmlEntities = (text: string) =>
  text
    .replace(/--/g, "&ndash;")
    .replace(/\.\.\./g, "&hellip;")
    .replace(/(\W)-&gt;/g, "$1&rArr;");

export = htmlEntities;
