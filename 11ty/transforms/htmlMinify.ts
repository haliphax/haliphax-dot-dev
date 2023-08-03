import { DOMParser } from '@xmldom/xmldom';
import { minify } from 'html-minifier';
import { transform } from 'esbuild';
import { UserConfig } from '@11ty/eleventy';

const scriptCache = new Map<string, string>();
const parser = new DOMParser({ errorHandler: { warning: () => { } } });

const htmlMinify = (cfg: UserConfig) =>
	cfg.addTransform(
		'htmlMinify',
		async (content: string, outputPath: string) => {
			if (!outputPath?.endsWith('.html')) {
				return content;
			}

			const doc = parser.parseFromString(content, 'text/html');
			const scripts = Array.from(doc.getElementsByTagName('script'))
				.filter(v => !v.src);

			for (let script of scripts) {
				if (script.id && scriptCache.has(script.id)) {
					script.textContent = scriptCache.get(script.id)!;
					continue;
				}

				script.textContent =
					(await transform(script.textContent!, { minify: true })).code;
				scriptCache.set(script.id, script.textContent);
			}

			return minify(doc.toString(), {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true,
			});
  });

export = htmlMinify;
