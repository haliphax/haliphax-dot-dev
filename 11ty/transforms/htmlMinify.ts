import { UserConfig } from "@11ty/eleventy";
import { DOMParser } from "@xmldom/xmldom";
import { transform } from "esbuild";
import { minify } from "html-minifier";

/** cache for content of script tags with an ID */
const scriptCache = new Map<string, string>();

/** DOM parser for navigating the rendered document; warnings are ignored */
const parser = new DOMParser({ errorHandler: { warning: () => {} } });

/** minify HTML and inline scripts */
const htmlMinify = (cfg: UserConfig) =>
	cfg.addTransform(
		"htmlMinify",
		async (content: string, outputPath: string) => {
			if (!outputPath?.endsWith(".html")) {
				return content;
			}

			const doc = parser.parseFromString(content, "text/html");
			const scripts = Array.from(doc.getElementsByTagName("script")).filter(
				(v) => !v.src,
			);

			for (let script of scripts) {
				// use cached content if it exists for this script's ID
				if (script.id && scriptCache.has(script.id)) {
					script.textContent = scriptCache.get(script.id)!;
					continue;
				}

				script.textContent = (
					await transform(script.textContent!, { minify: true })
				).code;

				// only cache scripts with an ID
				if (script.id) {
					scriptCache.set(script.id, script.textContent);
				}
			}

			return minify(doc.toString(), {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true,
			});
		},
	);

export = htmlMinify;
