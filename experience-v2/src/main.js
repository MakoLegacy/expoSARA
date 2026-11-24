import { gsap } from "gsap";
import { createLivingWorld } from "./living-world.js";
import { createChapterMotion } from "./chapter-motion.js";
import "./styles.css";

/**
 * V6 hybrid executive presentation controller.
 *
 * Wheel, keyboard, chapter markers and swipe are COMMANDS, not a scrubber.
 * A command selects a chapter; GSAP then plays a fully time-driven animation
 * with ease and stagger, independent of any further mouse movement.
 * The approved V4 website is built from a different branch.
 */
const camera = document.querySelector("#world-camera");
const highlights = document.querySelector(".world-highlights");
const shade = document.querySelector(".world-shade");
const image = document.querySelector("#mine-photo");
const warning = document.querySelector("#asset-warning");
const progress = document.querySelector("#progress-bar");
const scenes = [...document.querySelectorAll("[data-scene]")];
const navLinks = [...document.querySelectorAll("[data-nav]")];
const previousButton = document.querySelector("#prev-chapter");
const nextButton = document.querySelector("#next-chapter");
const chapterCount = document.querySelector("#chapter-count");
const replayButton = document.querySelector("#replay-motion");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const livingWorld = createLivingWorld({ reducedMotion: reduced });
const chapterMotion = createChapterMotion({ reducedMotion: reduced });

const looks = [
  // 01: Open pit panorama, detection context.
  { x: 0,    y: 0,    zoom: 1.12, glow: .00 },
  // 02: Move toward haul-road benches as the operational friction appears.
  { x: -2.2, y: -1.0, zoom: 1.22, glow: .04 },
  // 03: Clear front view for the four-zone lookup.
  { x: -3.8, y: 1.2,  zoom: 1.35, glow: .12 },
  // 04: Detail of the mine while the three inquiry engines are explained.
  { x: .8,   y: -.9,  zoom: 1.42, glow: .20 },
  // 05: A quiet, more open frame for consultation and prevention.
  { x: 2.0,  y: 1.1,  zoom: 1.30, glow: .10 },
  // 06: Operational benefits under an advancing atmospheric front.
  { x: -1.1, y: 1.5,  zoom: 1.36, glow: .14 },
  // 07: Return to a balanced overview for the leadership decision.
  { x: .3,   y: 0,    zoom: 1.23, glow: .04 }
];

const story = scenes.map((scene, index) => ({
  scene,
  inner: scene.querySelector(".scene-inner"),
  index,
  beats: [...scene.querySelectorAll("[data-beat]")].map(el => ({
    el,
    cue: Math.max(0, Number(el.dataset.beat) || 0)
  })).sort((a, b) => a.cue - b.cue)
}));
let activeIndex = -1;
let activeTimeline = null;
let lastNavigationAt = -Infinity;
let lastWheelAt = -Infinity;
let wheelTotal = 0;
let wheelGestureUsed = false;
let touchStart = null;
const cameraState = { position: 0 };
const CHAPTER_LOCK_MS = 2300;
const WHEEL_GAP_MS = 240;
const WHEEL_THRESHOLD = 48;
const clamp = (value, a, b) => Math.min(b, Math.max(a, value));

function getChapterFromHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const index = scenes.findIndex(scene => scene.id === id);
  return index >= 0 ? index : 0;
}

function isModalOpen() {
  return Boolean(document.querySelector("dialog[open]"));
}

function setChapterStatus(index, updateHash) {
  navLinks.forEach((link, i) => {
    if (i === index) link.setAttribute("aria-current", "step");
    else link.removeAttribute("aria-current");
  });
  if (previousButton) previousButton.disabled = index === 0;
  if (nextButton) nextButton.disabled = index === scenes.length - 1;
  if (chapterCount) chapterCount.textContent = String(index + 1).padStart(2, "0") +
    " / " + String(scenes.length).padStart(2, "0");
  document.body.dataset.chapter = String(index + 1).padStart(2, "0");
  gsap.to(progress, {
    width: (index / Math.max(1, scenes.length - 1) * 100).toFixed(2) + "%",
    duration: reduced ? 0 : 1.7, ease: "power2.inOut", overwrite: true
  });
  if (updateHash) {
    // One presentational history entry, not one for every wheel increment.
    window.history.replaceState(null, "", "#" + scenes[index].id);
  }
}

function prepareBeat(beat) {
  gsap.set(beat.el, { autoAlpha: 0, y: 28, scale: 0.982, filter: "blur(6px)" });
}

function showChapter(index, { initial = false, updateHash = true } = {}) {
  index = clamp(Math.round(index), 0, scenes.length - 1);
  if (!initial && index === activeIndex) return;
  const now = performance.now();
  // Only gestures are throttled at their own handlers; direct links can jump.
  lastNavigationAt = now;
  const previousIndex = activeIndex;
  activeIndex = index;

  chapterMotion.stop();
  if (activeTimeline) activeTimeline.kill();
  gsap.killTweensOf(camera);
  gsap.killTweensOf(highlights);
  gsap.killTweensOf(shade);
  gsap.killTweensOf(cameraState);

  for (const group of story) {
    gsap.killTweensOf(group.inner);
    gsap.killTweensOf(group.beats.map(beat => beat.el));
    group.scene.style.zIndex = group.index === index ? "4" :
      group.index === previousIndex ? "3" : "1";
    group.scene.style.pointerEvents = group.index === index ? "auto" : "none";
    group.inner.style.pointerEvents = group.index === index ? "auto" : "none";
    group.inner.inert = group.index !== index;
    if (group.index !== index && group.index !== previousIndex) {
      gsap.set(group.inner, { autoAlpha: 0, x: 0 });
    }
  }

  const next = story[index];
  // Always replay the story when returning to a chapter.
  next.beats.forEach(prepareBeat);
  gsap.set(next.inner, { autoAlpha: 0, x: 24 });

  setChapterStatus(index, updateHash);

  if (reduced) {
    story.forEach(group => gsap.set(group.inner, {
      autoAlpha: group.index === index ? 1 : 0, x: 0
    }));
    gsap.set(next.beats.map(beat => beat.el), {
      autoAlpha: 1, y: 0, scale: 1, filter: "none"
    });
    gsap.set(camera, {
      xPercent: looks[index].x, yPercent: looks[index].y, scale: looks[index].zoom
    });
    gsap.set(highlights, { opacity: looks[index].glow });
    gsap.set(shade, { opacity: 1 - Math.min(.12, looks[index].glow * .26) });
    cameraState.position = index;
    chapterMotion.play(next.scene);
    return;
  }

  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete() {
      if (previousIndex >= 0 && previousIndex !== index) {
        gsap.set(story[previousIndex].inner, { autoAlpha: 0, x: 0 });
      }
      // Explanatory graphics continue on their own while the presenter speaks.
      if (activeIndex === index && !isModalOpen()) chapterMotion.play(next.scene);
    }
  });
  activeTimeline = timeline;

  // The camera has a continuous 2.65 s cinematic travel. The audience does
  // not need to hold a scroll gesture for a single millisecond of that motion.
  timeline.to(camera, {
    xPercent: looks[index].x,
    yPercent: looks[index].y,
    scale: looks[index].zoom,
    duration: 2.65, ease: "power3.inOut"
  }, 0);
  timeline.to(highlights, {
    opacity: looks[index].glow,
    duration: 2.35, ease: "sine.inOut"
  }, 0);
  timeline.to(shade, {
    opacity: 1 - Math.min(.12, looks[index].glow * .26),
    duration: 2.35, ease: "sine.inOut"
  }, 0);
  timeline.to(cameraState, {
    position: index, duration: 2.8, ease: "power2.inOut"
  }, 0);
  if (previousIndex >= 0 && previousIndex !== index) {
    timeline.to(story[previousIndex].inner, {
      autoAlpha: 0, x: -26, duration: .67, ease: "power2.inOut"
    }, 0);
  }
  timeline.to(next.inner, {
    autoAlpha: 1, x: 0, duration: .9, ease: "power3.out"
  }, initial ? .08 : .55);

  // Each data-beat is a storytelling cue, not an interpolated scroll position.
  // E.g. system names, motors and zones reveal on their own schedule.
  for (const beat of next.beats) {
    const at = (initial ? .20 : .70) + beat.cue * 3.35;
    timeline.to(beat.el, {
      autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)",
      duration: .70, ease: "power3.out"
    }, at);
  }
}

// Ambient weather continues to animate even while the presenter is speaking.
gsap.ticker.add(time => livingWorld.render(time, cameraState.position));

if (image) {
  const okay = () => { warning.hidden = true; document.body.classList.add("asset-loaded"); };
  const missing = () => { warning.hidden = false; document.body.classList.add("asset-missing"); };
  image.addEventListener("load", okay);
  image.addEventListener("error", missing);
  if (image.complete) (image.naturalWidth ? okay : missing)();
}

// A wheel gesture means "advance one chapter", not "move a video timeline".
window.addEventListener("wheel", event => {
  if (isModalOpen()) return;
  if (event.ctrlKey) return; // Preserve browser zoom.
  event.preventDefault();
  const now = performance.now();
  if (now - lastWheelAt > WHEEL_GAP_MS) {
    wheelTotal = 0;
    wheelGestureUsed = false;
  }
  lastWheelAt = now;
  const units = event.deltaMode === 1 ? event.deltaY * 16 :
    event.deltaMode === 2 ? event.deltaY * window.innerHeight : event.deltaY;
  wheelTotal += units;
  if (wheelGestureUsed || Math.abs(wheelTotal) < WHEEL_THRESHOLD) return;
  // Ignore the rest of this gesture when a transition is still playing.
  // Otherwise trackpad momentum could unexpectedly skip an additional chapter.
  wheelGestureUsed = true;
  if (now - lastNavigationAt < CHAPTER_LOCK_MS) return;
  showChapter(activeIndex + Math.sign(wheelTotal));
}, { passive: false });

window.addEventListener("keydown", event => {
  if (isModalOpen() || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.target.closest("input,textarea,select,[contenteditable=true]")) return;
  if (event.key.toLowerCase() === "r") {
    event.preventDefault();
    chapterMotion.play(scenes[activeIndex]);
    return;
  }
  const next = ["ArrowDown", "ArrowRight", "PageDown", " "];
  const previous = ["ArrowUp", "ArrowLeft", "PageUp"];
  if (next.includes(event.key) || previous.includes(event.key)) {
    // Space on a focused button or link should still activate that control.
    if (event.key === " " && event.target.closest("button,a")) return;
    event.preventDefault();
    if (performance.now() - lastNavigationAt >= 350) {
      showChapter(activeIndex + (next.includes(event.key) ? 1 : -1));
    }
  } else if (event.key === "Home") {
    event.preventDefault(); showChapter(0);
  } else if (event.key === "End") {
    event.preventDefault(); showChapter(scenes.length - 1);
  }
});

window.addEventListener("touchstart", event => {
  if (isModalOpen() || event.touches.length !== 1) return;
  touchStart = { y: event.touches[0].clientY, x: event.touches[0].clientX };
}, { passive: true });
window.addEventListener("touchend", event => {
  if (!touchStart || isModalOpen()) return;
  const dy = touchStart.y - event.changedTouches[0].clientY;
  const dx = touchStart.x - event.changedTouches[0].clientX;
  touchStart = null;
  if (Math.abs(dy) > 55 && Math.abs(dy) > Math.abs(dx) * 1.35 &&
      performance.now() - lastNavigationAt >= CHAPTER_LOCK_MS) {
    showChapter(activeIndex + Math.sign(dy));
  }
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", event => {
    const destination = anchor.getAttribute("href")?.slice(1);
    const index = scenes.findIndex(scene => scene.id === destination);
    if (index < 0) return;
    event.preventDefault();
    showChapter(index);
  });
});
previousButton?.addEventListener("click", () => showChapter(activeIndex - 1));
nextButton?.addEventListener("click", () => showChapter(activeIndex + 1));
replayButton?.addEventListener("click", () => {
  if (!isModalOpen() && activeIndex >= 0) chapterMotion.play(scenes[activeIndex]);
});
window.addEventListener("hashchange", () => showChapter(getChapterFromHash(), { updateHash: false }));

// Initialize invisible inactive chapters; opening chapter plays automatically.
for (const group of story) {
  gsap.set(group.inner, { autoAlpha: 0, x: 0 });
  group.inner.inert = true;
  group.scene.style.pointerEvents = "none";
  group.beats.forEach(prepareBeat);
}
gsap.set(camera, {
  xPercent: looks[0].x, yPercent: looks[0].y, scale: looks[0].zoom
});
showChapter(getChapterFromHash(), { initial: true, updateHash: false });

// Presenter-facing QR in slide 03. The QR always encodes the actual S.A.R.A.
// web application, not this presentation or a simulated telemetry endpoint.
const saraQrDialog = document.querySelector("#sara-qr-dialog");
const showSaraQr = document.querySelector("#show-sara-qr");
showSaraQr?.addEventListener("click", () => {
  chapterMotion.stop();
  saraQrDialog?.showModal();
});
document.querySelector("#close-sara-qr")?.addEventListener("click", () => saraQrDialog?.close());
saraQrDialog?.addEventListener("click", event => {
  if (event.target === saraQrDialog) saraQrDialog.close();
});
saraQrDialog?.addEventListener("close", () => {
  if (activeIndex >= 0 && !isModalOpen()) chapterMotion.play(scenes[activeIndex]);
});

// System info dialogs. StrikeGuard is contextualized, not represented as a
// live source feeding S.A.R.A.'s Keraunos consultation engines.
const infoDialog=document.querySelector("#info-dialog");
const heading=document.querySelector("#dialog-heading");
const detail=document.querySelector("#dialog-text");
const info={
  strikeguard:{
    title:"STRIKEGUARD",
    message:"Sistema reactivo de detección de descargas nube–tierra. Forma parte de los sistemas de monitoreo utilizados por el Centro de Control."
  },
  keraunos:{
    title:"KERAUNOS",
    message:"Sistema de monitoreo predictivo de condiciones eléctricas. Su interfaz web es la fuente que consultan los tres motores de S.A.R.A."
  }
};
document.querySelectorAll("[data-info]").forEach(button=>button.addEventListener("click",()=>{
  const content=info[button.dataset.info];
  if(!content)return;
  heading.textContent=content.title;
  detail.textContent=content.message;
  infoDialog?.showModal();
}));
document.querySelector("#close-info")?.addEventListener("click",()=>infoDialog?.close());
infoDialog?.addEventListener("click",e=>{if(e.target===infoDialog)infoDialog.close()});

// Optional technical continuity exploration — not a claim that S.A.R.A. is
// completely redundant. Three motors consult the same Keraunos source.
const continuityDialog=document.querySelector("#continuity-dialog");
document.querySelector("#show-continuity")?.addEventListener("click",()=>{
  chapterMotion.stop();
  continuityDialog?.showModal();
  resetFallback();
});
document.querySelector("#close-continuity")?.addEventListener("click",()=>continuityDialog?.close());
continuityDialog?.addEventListener("close", () => chapterMotion.play(scenes[activeIndex]));
continuityDialog?.addEventListener("click",e=>{
  if(e.target===continuityDialog)continuityDialog.close();
});
const api=document.querySelector("#fail-api");
const motors=[...document.querySelectorAll("[data-motor]")];
const keraunos=document.querySelector("#fail-keraunos");
const strike=document.querySelector("#strike-final");
const status=document.querySelector("#sim-status");
const backupTrack=document.querySelector("#continuity-track");
const stages=Object.fromEntries([...document.querySelectorAll(".continuity-stage[data-stage]")].map(el=>[el.dataset.stage,el]));
const connectors=Object.fromEntries([...document.querySelectorAll(".continuity-link[data-link]")].map(el=>[el.dataset.link,el]));
const trackElements=[...document.querySelectorAll(".continuity-stage,.continuity-link")];
let fallback={},flowTimeline=null,simBusy=false;

function setStatus(message){if(status)status.textContent=message}
function markFailed(node){
  node.classList.remove("active");
  node.classList.add("failed");
  node.querySelector("small").textContent="FUERA DE SERVICIO";
  if(node.tagName==="BUTTON")node.disabled=true;
}
function markActive(node,label){
  node.classList.add("active");
  if(node.tagName==="BUTTON")node.disabled=false;
  if(label)node.querySelector("small").textContent=label;
}
function visibleTrackElements(){
  return trackElements.filter(el=>!el.hidden);
}

// FLIP layout animation: before opening a new branch, existing nodes occupy
// the center. After opening it, all visible nodes move into the wider layout.
// The camera does not move and the diagram grows from its middle.
function extendContinuity(stageName,linkName,after){
  if(simBusy)return;
  simBusy=true;
  const oldNodes=visibleTrackElements();
  const from=new Map(oldNodes.map(el=>[el,el.getBoundingClientRect()]));
  const stage=stages[stageName];
  const link=connectors[linkName];
  stage.hidden=false; link.hidden=false;
  const to=new Map(oldNodes.map(el=>[el,el.getBoundingClientRect()]));

  if(reduced){
    gsap.set(trackElements,{clearProps:"all"});
    simBusy=false;
    after?.();
    return;
  }
  if(flowTimeline)flowTimeline.kill();
  gsap.set([stage,link],{autoAlpha:0});
  gsap.set(link.querySelector(".link-line"),{scaleX:0,transformOrigin:"left center"});
  gsap.set(link.querySelector(".link-arrow"),{opacity:0,x:-7});

  flowTimeline=gsap.timeline({
    defaults:{ease:"power3.inOut"},
    onComplete(){
      simBusy=false;
      after?.();
    }
  });
  // Move every earlier block as the whole diagram makes room to its left.
  for(const el of oldNodes){
    const dx=from.get(el).left-to.get(el).left;
    const dy=from.get(el).top-to.get(el).top;
    if(Math.abs(dx)>1||Math.abs(dy)>1){
      flowTimeline.fromTo(el,{x:dx,y:dy},{x:0,y:0,duration:1.0},0);
    }
  }
  flowTimeline.to(link,{autoAlpha:1,duration:.15},.32);
  flowTimeline.to(link.querySelector(".link-line"),{scaleX:1,duration:.63,ease:"power2.out"},.34);
  flowTimeline.to(link.querySelector(".link-arrow"),{opacity:1,x:0,duration:.28},.83);
  flowTimeline.fromTo(stage,{autoAlpha:0,x:24,scale:.95},{autoAlpha:1,x:0,scale:1,duration:.75,ease:"power3.out"},.62);
}

function resetFallback(){
  if(flowTimeline)flowTimeline.kill();
  simBusy=false;
  fallback={api:false,motors:[false,false,false],keraunos:false};
  stages.api.hidden=false;
  for(const name of ["motors","keraunos","strike"])stages[name].hidden=true;
  Object.values(connectors).forEach(link=>link.hidden=true);
  gsap.set(trackElements,{clearProps:"all"});
  document.querySelectorAll(".link-line,.link-arrow").forEach(el=>gsap.set(el,{clearProps:"all"}));
  [api,...motors,keraunos,strike].forEach(node=>{
    node.classList.remove("active","failed");
    if(node.tagName==="BUTTON")node.disabled=true;
  });
  api.querySelector("small").textContent="SIMULAR FALLA DE API";
  motors.forEach(node=>node.querySelector("small").textContent="RESPALDO WEB");
  keraunos.querySelector("small").textContent="SIMULAR INDISPONIBILIDAD";
  strike.querySelector("small").textContent="RESPALDO PROCEDIMENTAL";
  markActive(api);
  setStatus("Escenario inicial propuesto: un motor consulta la API de Keraunos. Haz clic para simular una falla.");
}

api?.addEventListener("click",()=>{
  if(simBusy||fallback.api)return;
  fallback.api=true;
  markFailed(api);
  setStatus("API no disponible. La estrategia de respaldo abre los 3 motores que consultan la web Keraunos.");
  extendContinuity("motors","api-motors",()=>{
    motors.forEach(node=>markActive(node,"SIMULAR FALLA"));
    setStatus("Motores 01, 02 y 03 de consulta web disponibles. Simula sus fallas individualmente.");
  });
});
motors.forEach((motor,i)=>motor.addEventListener("click",()=>{
  if(simBusy||!fallback.api||fallback.motors[i])return;
  fallback.motors[i]=true;
  markFailed(motor);
  const count=fallback.motors.filter(Boolean).length;
  if(count<3){
    setStatus(count+" de 3 motores web fuera de servicio. Continúan los motores restantes.");
    if(!reduced)gsap.fromTo(motor,{scale:.95},{scale:1,duration:.35,ease:"back.out(1.4)"});
    return;
  }
  setStatus("Los tres motores web quedaron inoperativos. Se abre la consulta manual de Keraunos.");
  extendContinuity("keraunos","motors-keraunos",()=>{
    markActive(keraunos,"SIMULAR INDISPONIBILIDAD");
    setStatus("Consulta manual Keraunos disponible. Puedes simular su indisponibilidad.");
  });
}));
keraunos?.addEventListener("click",()=>{
  if(simBusy||!fallback.motors.every(Boolean)||fallback.keraunos)return;
  fallback.keraunos=true;
  markFailed(keraunos);
  setStatus("Keraunos manual no está disponible. Continúa el procedimiento manual con StrikeGuard.");
  extendContinuity("strike","keraunos-strike",()=>{
    markActive(strike,"ÚLTIMO RESPALDO");
    setStatus("Última capa: comunicación manual con StrikeGuard, según el procedimiento vigente. Fin de la simulación.");
  });
});
document.querySelector("#reset-sim")?.addEventListener("click",resetFallback);
resetFallback();
