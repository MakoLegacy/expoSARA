import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { clamp01, smoothstep, climateAt } from "../src/living-world.js";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const main=fs.readFileSync(path.join(root,"src","main.js"),"utf8");
const css=fs.readFileSync(path.join(root,"src","styles.css"),"utf8");
const weather=fs.readFileSync(path.join(root,"src","living-world.js"),"utf8");

assert.equal(clamp01(-10),0);
assert.equal(clamp01(2),1);
assert.equal(smoothstep(0,1,0),0);
assert.equal(smoothstep(0,1,1),1);

const keys=["cloud","darkness","rain","digital","lightning"];
let last=climateAt(0);
for(let chapter=0;chapter<=6;chapter+=.05){
  const state=climateAt(chapter);
  for(const key of keys){
    assert(state[key]>=0 && state[key]<=1,key+" bounded");
    assert(state[key]>=last[key]-1e-12,key+" must rise with story progress");
  }
  last=state;
}
assert.equal(climateAt(0).rain,0);
assert.equal(climateAt(6).rain,1);

assert.equal((html.match(/data-scene="\d"/g)||[]).length,7,"Exactly 7 hybrid executive narrative chapters");
assert.equal((html.match(/data-nav="\d\d"/g)||[]).length,7,"7 numbered navigation links");
assert((html.match(/data-beat="/g)||[]).length>=60,"Semantic time-driven visual beats for seven chapters");
assert(html.includes("SISTEMA DE ALERTA Y RESPUESTA ANTAMINA"));
assert.equal((html.match(/class="sara-mark"/g)||[]).length,2,"New three-stroke identity appears on cover and closing");
assert(html.includes("DETECTAR <b>·</b> COMPRENDER <b>·</b> RESPONDER"));
assert(!html.includes("RUEDA O FLECHAS PARA AVANZAR"),"Old slide cue removed");
assert(css.includes(".scene .eyebrow"),"Chapter titles enlarged");

assert(html.includes("Sistema de Alerta y Respuesta Antamina"));
assert(html.includes("DE LA DETECCIÓN"));
assert(html.includes("STRIKEGUARD") && html.includes("KERAUNOS"));
assert(html.includes("data-info="));
assert.equal((html.match(/class="engine beat"/g)||[]).length,3,"3 motors");
assert.equal((html.match(/class="zone-item beat"/g)||[]).length,4,"4 zones");
assert.equal((html.match(/class="value-row beat"/g)||[]).length,3,"3 stakeholders");
assert.equal((html.match(/class="future-step beat"/g)||[]).length,3,"3 future priorities");
assert(html.includes("https://qr.keraunos.co/t/mHMsMSjw7fLzlVFzMsh9K99cFG7tiC"));
assert(html.includes("https://antito-yanac.github.io/sara/"));
assert(html.includes('id="continuity-track"'),"Progressively revealed contingency stage retained");
assert(html.includes('data-stage="api"') && html.includes('data-stage="motors"') && html.includes('data-stage="keraunos"') && html.includes('data-stage="strike"'),"API-first continuity flow");
assert(html.includes("API KERAUNOS"),"Primary API scenario clearly labeled");
assert(html.includes("motor único de consulta directa") || html.includes("Motor único de consulta directa"),"Primary API uses a single engine");
assert(html.includes("Los 3 consultan la misma web Keraunos"),"Shared web Keraunos source not misrepresented");
assert(html.includes('data-link="api-motors"') && html.includes('data-link="motors-keraunos"') && html.includes('data-link="keraunos-strike"'),"All three connecting edges");
assert(main.includes("getBoundingClientRect"),"FLIP layout transition of previous stages");
assert(main.includes('extendContinuity("motors","api-motors"'),"API failure opens web-engine backup");
assert(main.includes('extendContinuity("keraunos","motors-keraunos"'),"Three motor failures open manual Keraunos");
assert(main.includes('extendContinuity("strike","keraunos-strike"'),"Manual Keraunos failure opens StrikeGuard");

assert(html.includes('id="show-continuity"'),"Technical detail accessed on demand");
assert(html.includes('id="mine-photo"'),"One persistent mine scene");
assert(!html.includes('class="haul-vehicle"'),"No artificial trucks");
assert(!html.includes('class="mine-excavator'),"No artificial excavators");
assert(!main.includes("ScrollTrigger"),"No conflicting one-shot scroll animations");
assert(main.includes("gsap.timeline("),"Cinematic sequence advances automatically after a gesture");
assert(main.includes('window.addEventListener("wheel"'),"Mouse wheel supports discrete chapter navigation");
assert(main.includes('window.addEventListener("keydown"'),"Keyboard arrows control chapters");
assert(main.includes('window.addEventListener("touchend"'),"Touch swipe controls chapters");
assert(main.includes("CHAPTER_LOCK_MS"),"Gesture cooldown prevents accidental multi-chapter skips");
assert(main.includes("duration: 2.65"),"Camera movement has autonomous cinematic timing");
assert(main.includes("beat.cue * 3.35"),"Narrative beats are sequenced by elapsed time");
assert(!main.includes("window.scrollY"),"Animations must NOT scrub against document scrollY");
assert(html.includes('id="prev-chapter"') && html.includes('id="next-chapter"'),"Visible presentation controls remain available");
assert(weather.includes("createLivingWorld"));
assert(!weather.includes("getPointAtLength"),"No truck path animation");
assert(css.includes("position:fixed"),"Cinematic fixed-scene scrollytelling");
assert(css.includes("V5.1 — CINEMATIC PRESENTATION MODE"),"The layout is fixed-stage presentation mode");
assert(main.includes("onComplete()"),"Transitions finish without further wheel input");

// V6 semantic and safety regressions
assert(html.includes('id="capitulo-07"'),"Technical continuity has its own final chapter");
assert(html.includes('01 / CONTEXTO OPERACIONAL'));
assert(html.includes('02 / LA PROBLEMÁTICA'));
assert(html.includes('03 / LA SOLUCIÓN'));
assert(html.includes('04 / INGENIERÍA APLICADA'));
assert(html.includes('05 / CULTURA PREVENTIVA'));
assert(html.includes('06 / VALOR PARA ANTAMINA'));
assert(html.includes('07 / CONTINUIDAD Y VISIÓN'));
assert(html.includes('id="chapter-count"') && html.includes('01 / 07'),"Navigation counter starts with seven");
assert(html.includes('href="#capitulo-07"'),"Navigation reaches final chapter");
assert.equal((main.match(/zoom:\s*[0-9.]+/g)||[]).length,7,"One cinematic camera mark per chapter");
assert(html.includes("MONITOREO 24/7") && html.includes("AVISO RADIAL"),"Official radio channel is explained");
assert(html.includes("No los sustituye"),"S.A.R.A. does not replace official notices");
assert(html.includes("Hoy no existe una práctica formal de consulta"),"Current consultation gap is explicit");
assert(html.includes("CONSULTA PREVIA: HÁBITO PROPUESTO"),"A proposed habit is not presented as existing procedure");
assert(html.includes("no envía avisos en segundo plano"),"In-app-only alerts are disclosed accurately");
assert(html.includes("AVISO DENTRO DE S.A.R.A."),"No misleading push notification depiction");
assert.equal((html.match(/class="prevention-step beat"/g)||[]).length,3,"Prevention lifecycle: before, during, when alert arrives");
assert(html.includes("ANTE UNA ALERTA") && html.includes("RESPONDER"));
assert(html.includes("FUENTE ACTUAL") && html.includes("WEB KERAUNOS"),"Three engines use existing web source");
assert(html.includes("integración API") && html.includes("sujetas a validación"),"API remains proposed");
assert(html.includes("Beneficios esperados"),"No unjustified measured claims");
assert(css.includes(".prevention-timeline"),"Distinct motion-graphic prevention sequence");

console.log("S.A.R.A. hybrid executive V6: seven autonomous chapters, operational context, prevention culture, fallback — OK");
