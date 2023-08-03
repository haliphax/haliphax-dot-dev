import { readFileSync } from "fs";
import { fileOpts } from "../misc";
const eleventyPackage = JSON.parse(
  readFileSync("node_modules/@11ty/eleventy/package.json", fileOpts),
);

const data = {
  author: "haliphax",
  description:
    "Software engineer. Textmode artist. I enjoy solving problems and sharing what I have learned with others.",
  generator: `${eleventyPackage.name} v${eleventyPackage.version}`,
  openGraphImageUrl:
    "https://res.cloudinary.com/haliphax/image/upload/c_scale,e_blur:150,q_auto,w_1200,h_600/fl_no_overflow,c_scale,g_north_west,l_haliphax.dev:hx-transparent_y2yati,r_0,w_150,x_20,y_20/bo_8px_solid_rgb:000000,c_scale,g_center,l_text:shrikhand_96_stroke_center:{title},co_white,c_fit,fl_text_no_trim,fl_text_disallow_overflow,w_600,w_1200/v1639552617/haliphax.dev/stream-bg-2_mdc1sc.jpg",
  openGraphType: "article",
};

export = data;
