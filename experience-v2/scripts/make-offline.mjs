import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "dist-offline");
const photoFile = path.join(root, "public", "assets", "antamina-cinematic.webp");
const qrFile = path.join(root, "public", "assets", "qr-sara.svg");
const htmlFile = path.join(outputDir, "index.html");
const outputFile = path.join(outputDir, "SARA_V6_PREVIEW_OFFLINE.html");

async function requiredFile(file, label) {
  try { return await fs.readFile(file); }
  catch {
    throw new Error(label + ": " + file + ". Copia la imagen del paquete V3 antes de ejecutar build:offline.");
  }
}

const imageData = await requiredFile(photoFile, "Falta la imagen cinematográfica");
const qrData = await requiredFile(qrFile, "Falta el QR de S.A.R.A.");
let html = (await requiredFile(htmlFile, "Falta el HTML compilado")).toString("utf8");
const assetsDir = path.join(outputDir, "assets");
const assets = await fs.readdir(assetsDir);
const jsName = assets.find(name => /^index-[\w-]+\.js$/.test(name));
const cssName = assets.find(name => /^index-[\w-]+\.css$/.test(name));
if (!jsName || !cssName) {
  throw new Error("No se encontró el JS o CSS de Vite en dist-offline/assets.");
}
const js = (await fs.readFile(path.join(assetsDir, jsName), "utf8"))
  .replace(/<\/script/gi, "<\\/script");
const css = (await fs.readFile(path.join(assetsDir, cssName), "utf8"))
  .replace(/<\/style/gi, "<\\/style");

const scriptPattern = /<script\b[^>]*\bsrc=["'][^"']+\.js["'][^>]*>\s*<\/script>/i;
const stylePattern = /<link\b[^>]*\bhref=["'][^"']+\.css["'][^>]*\/?>/i;
const photoPattern = /(<img\b(?=[^>]*\bid=["']mine-photo["'])[^>]*\bsrc=["'])[^"']+(["'][^>]*>)/i;

if (!scriptPattern.test(html) || !stylePattern.test(html) || !photoPattern.test(html)) {
  throw new Error("No fue posible localizar todos los recursos en el HTML compilado.");
}
html = html.replace(scriptPattern, () => "<script type=\"module\">" + js + "</script>");
html = html.replace(stylePattern, () => "<style>" + css + "</style>");
html = html.replace(photoPattern, (_all, before, after) =>
  before + "data:image/webp;base64," + imageData.toString("base64") + after);
// Preserve both QR displays without network access. The public online version
// keeps the same genuine QR resource served by GitHub Pages.
const qrPattern = /(<img\b[^>]*\bsrc=["'])([^"']*qr-sara\.svg)(["'][^>]*>)/gi;
const qrCount = (html.match(/qr-sara\.svg/g) || []).length;
if (qrCount !== 2) {
  throw new Error("Se esperaban dos referencias al QR en la presentación.");
}
html = html.replace(qrPattern, (_all, before, _url, after) =>
  before + "data:image/svg+xml;base64," + qrData.toString("base64") + after);
if (html.includes("qr-sara.svg")) throw new Error("El QR no se incrustó correctamente en el HTML portable.");
html = html.replace(/<link\b[^>]*(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*\/?>/gi, "");
html = html.replace(/<link\b[^>]*rel=["']modulepreload["'][^>]*\/?>/gi, "");
await fs.writeFile(outputFile, html, "utf8");
console.log("S.A.R.A. V6 portable: " + outputFile);
console.log("CSS, JS e imagen incrustados. Abre el HTML con doble clic en Chrome/Edge.");
console.log("Los enlaces a Keraunos y S.A.R.A. requieren internet.");
