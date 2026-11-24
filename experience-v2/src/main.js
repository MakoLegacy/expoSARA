import { gsap } from "gsap";
import { createLivingWorld } from "./living-world.js";
import "./styles.css";

/**
 * V5 cinematic presentation controller.
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
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const livingWorld = createLivingWorld({ reducedMotion: reduced });

const looks = [
  { x: 0,    y: 0,    zoom: 1.12, glow: .00 },
  { x: -2.2, y: -1.0, zoom: 1.22, glow: .05 },
  { x: -3.8, y: 1.2,  zoom: 1.35, glow: .10 },
  { x: .8,   y: -.9,  zoom: 1.42, glow: .18 },
  { x: 2.2,  y: 1.6,  zoom: 1.36, glow: .12 },
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
    return;
  }

  const timeline = gsap.timeline({
    defaults: { overwrite: "auto" },
    onComplete() {
      if (previousIndex >= 0 && previousIndex !== index) {
        gsap.set(story[previousIndex].inner, { autoAlpha: 0, x: 0 });
      }
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
  continuityDialog?.showModal();
  resetFallback();
});
document.querySelector("#close-continuity")?.addEventListener("click",()=>continuityDialog?.close());
continuityDialog?.addEventListener("click",e=>{
  if(e.target===continuityDialog)continuityDialog.close();
});
const api=document.querySelector("#fail-api");
const motors=[...document.querySelectorAll("[data-motor]")];
const keraunos=document.querySelector("#fail-keraunos");
const strike=document.querySelector("#strike-final");
const status=document.querySelector("#sim-status");
const connectors=Object.fromEntries([...document.querySelectorAll("[data-link]")].map(el=>[el.dataset.link,el]));
let fallback={},generation=0;
function setStatus(message){if(status)status.textContent=message}
function failNode(node){
  node.classList.remove("active");node.classList.add("failed");
  node.querySelector("small").textContent="FUERA DE SERVICIO";
  if(node.tagName==="BUTTON")node.disabled=true;
}
function activateNode(node){
  node.classList.add("active");
  if(node.tagName==="BUTTON")node.disabled=false;
}
function delayedActivation(node,delay){
  const cycle=generation;
  if(reduced)activateNode(node);
  else gsap.delayedCall(delay,()=>{if(cycle===generation)activateNode(node)});
}
function resetFallback(){
  generation++;
  fallback={api:false,motors:[false,false,false],keraunos:false};
  [api,...motors,keraunos,strike].forEach(node=>{
    node.classList.remove("active","failed");
    node.querySelector("small").textContent=node===api?"CLIC PARA SIMULAR FALLA":node===strike?"ÚLTIMO RESPALDO":"RESPALDO";
    if(node.tagName==="BUTTON")node.disabled=true;
  });
  Object.values(connectors).forEach(el=>el.classList.remove("on","failed"));
  activateNode(api);
  setStatus("Haz clic en FUENTE / CONSULTA para iniciar la simulación conceptual.");
}
api?.addEventListener("click",()=>{
  if(fallback.api)return;
  fallback.api=true;
  failNode(api);
  connectors["api-motors"].classList.add("on");
  motors.forEach((motor,i)=>delayedActivation(motor,.18+i*.21));
  setStatus("Simulación: falla de consulta. Prueba los tres procesos de respaldo.");
});
motors.forEach((motor,i)=>motor.addEventListener("click",()=>{
  if(!fallback.api ||fallback.motors[i])return;
  fallback.motors[i]=true;failNode(motor);
  const count=fallback.motors.filter(Boolean).length;
  if(count===3){
    connectors["motors-keraunos"].classList.add("on");
    delayedActivation(keraunos,.35);
    setStatus("Tres motores fuera de servicio. Se plantea consulta manual mediante Keraunos.");
  }else setStatus(count+" de 3 motores deshabilitados en la simulación.");
}));
keraunos?.addEventListener("click",()=>{
  if(!fallback.motors.every(Boolean)||fallback.keraunos)return;
  fallback.keraunos=true;failNode(keraunos);
  connectors["keraunos-strike"].classList.add("on");
  delayedActivation(strike,.35);
  setStatus("Se plantea el procedimiento manual establecido con StrikeGuard.");
});
document.querySelector("#reset-sim")?.addEventListener("click",resetFallback);
resetFallback();
