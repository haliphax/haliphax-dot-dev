const fs = require('fs');

/** inline script file with anonymous, auto-executing function */
const inlineScript = (path) => `(() => {\n${fs.readFileSync(path)}\n})();`;

module.exports = inlineScript;
