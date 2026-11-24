import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const js=fs.readFileSync(path.join(root,"src","main.js"),"utf8");
const css=fs.readFileSync(path.join(root,"src","styles.css"),"utf8");

assert(html.includes("SISTEMA DE ALERTA Y RESPUESTA ANTAMINA"));
assert(html.includes("Sistema de Alerta y Respuesta Antamina"));
assert(!/sistema de alerta de rayos antamina/i.test(html));
assert(!html.includes("UN MISMO ENTORNO."));
assert(!html.includes("SIETE PERSPECTIVAS."));
assert(!html.includes("Propuestas de la presentación original; no indican implementación ya completada."));
assert(html.includes("DETECCIÓN") && html.includes("MONITOREO 24/7") && html.includes("AVISO RADIAL"));
assert(css.includes("#capitulo-01 .micro-flow"));

assert.equal((html.match(/class="sara-mark"/g)||[]).length,2,"Header and closing SARA logos");
assert(html.includes("DETECTAR <b>·</b> COMPRENDER <b>·</b> RESPONDER"));
assert(html.includes('id="fallback-sim" class="continuity-track"'));
assert.equal((html.match(/data-motor="\d"/g)||[]).length,3);
for(const stage of ["api","motors","keraunos","strike"]){
  assert(html.includes('data-stage="'+stage+'"'),"Missing fallback stage "+stage);
}
assert(js.includes("extendContinuity"));
assert(js.includes('extendContinuity("motors","api-motors"'));
assert(js.includes('extendContinuity("keraunos","motors-keraunos"'));
assert(js.includes('extendContinuity("strike","keraunos-strike"'));
assert.equal((js.match(/function markActive\(/g)||[]).length,1,"Do not redefine slide-nav function");
assert.equal((js.match(/function markBackupActive\(/g)||[]).length,1,"Fallback has distinct activation function");
assert(css.includes(".continuity-viewport"));
assert(html.includes("https://antito-yanac.github.io/sara/"));
assert(html.includes("https://qr.keraunos.co/t/mHMsMSjw7fLzlVFzMsh9K99cFG7tiC"));

console.log("Approved V4 checks passed: official name, cover, larger flow, progressive fallback and SARA logo.");
