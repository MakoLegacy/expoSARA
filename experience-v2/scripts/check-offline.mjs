import fs from "node:fs";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const output=path.join(root,"dist-offline");
const assets=path.join(output,"assets");
const filenames=fs.readdirSync(assets);
const jsName=filenames.find(x=>/^index-[\w-]+\.js$/.test(x));
const cssName=filenames.find(x=>/^index-[\w-]+\.css$/.test(x));
assert(jsName && cssName,"Compiled JS and CSS expected");

const expectedJs=fs.readFileSync(path.join(assets,jsName),"utf8").replace(/<\/script/gi,"<\\/script");
const expectedCss=fs.readFileSync(path.join(assets,cssName),"utf8").replace(/<\/style/gi,"<\\/style");
const html=fs.readFileSync(path.join(output,"SARA_V5_PREVIEW_OFFLINE.html"),"utf8");
const jsMatch=html.match(/<script type="module">([\s\S]*?)<\/script>/);
const cssMatch=html.match(/<style>([\s\S]*?)<\/style>/);
assert(jsMatch && cssMatch,"Embedded JS/CSS expected");
assert.equal(jsMatch[1],expectedJs,"Embedded JS differs from production bundle");
assert.equal(cssMatch[1],expectedCss,"Embedded CSS differs from production bundle");
assert(html.includes("data:image/webp;base64,"),"Embedded photographic image expected");
assert(!html.includes('<script type="module" crossorigin src='),"No external JS dependency expected");
console.log("Offline V5 verified: JavaScript and CSS are byte-for-byte identical to the compiled bundles.");
