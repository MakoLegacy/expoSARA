import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createLivingWorld } from "./living-world.js";
import "./styles.css";
gsap.registerPlugin(ScrollTrigger);

// V4 story camera. The same photographic representation persists behind every
// chapter: these are simulated 2.5D camera moves, not a surveyed 3D terrain.
const camera = document.querySelector("#world-camera");
const highlights = document.querySelector(".world-highlights");
const shade = document.querySelector(".world-shade");
const image = document.querySelector("#mine-photo");
const warning = document.querySelector("#asset-warning");
const progress = document.querySelector("#progress-bar");
const scenes = [...document.querySelectorAll("[data-scene]")];
const navLinks = [...document.querySelectorAll("[data-nav]")];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const livingWorld = createLivingWorld({ reducedMotion:reduced });

const looks = [
  { x:  0.0, y:  0.0, zoom: 1.12, glow: .07 },
  { x: -1.6, y: -1.3, zoom: 1.23, glow: .09 },
  { x: -3.8, y:  1.2, zoom: 1.35, glow: .11 },
  { x: -1.4, y:  0.0, zoom: 1.42, glow: .28 },
  { x:  1.8, y: -1.7, zoom: 1.46, glow: .40 },
  { x:  2.8, y:  1.1, zoom: 1.37, glow: .47 },
  { x:  0.1, y:  0.0, zoom: 1.22, glow: .28 }
];
let scrollTarget = 0, smoothPosition = 0, activeIndex = -1, pointerX = 0, pointerY = 0;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const mix = (a, b, t) => a + (b - a) * t;
const lerpLook = (a, b, t) => ({
  x: mix(a.x, b.x, t), y: mix(a.y, b.y, t),
  zoom: mix(a.zoom, b.zoom, t), glow: mix(a.glow, b.glow, t)
});

function getStoryPosition() {
  const center = window.scrollY + window.innerHeight * .52;
  const stops = scenes.map(scene => scene.offsetTop + scene.offsetHeight * .52);
  if (center <= stops[0]) return 0;
  for (let i = 0; i < stops.length - 1; i++) {
    if (center <= stops[i + 1]) return i + clamp((center - stops[i]) / (stops[i + 1] - stops[i]), 0, 1);
  }
  return stops.length - 1;
}

function markActive(index) {
  if (index === activeIndex) return;
  activeIndex = index;
  navLinks.forEach((link, i) => {
    if (i === index) link.setAttribute("aria-current", "step");
    else link.removeAttribute("aria-current");
  });
  document.body.dataset.chapter = String(index).padStart(2, "0");
}

function syncScroll() {
  scrollTarget = getStoryPosition();
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  progress.style.width = (clamp(window.scrollY / maxScroll, 0, 1) * 100).toFixed(2) + "%";
  markActive(Math.min(looks.length - 1, Math.floor(scrollTarget + .52)));
}

function renderCamera(frameTime = 0) {
  smoothPosition = reduced ? scrollTarget : mix(smoothPosition, scrollTarget, .092);
  const low = Math.min(looks.length - 1, Math.floor(smoothPosition));
  const high = Math.min(looks.length - 1, low + 1);
  const t = smoothPosition - low;
  const look = lerpLook(looks[low], looks[high], t);
  const microX = reduced ? 0 : pointerX * .45;
  const microY = reduced ? 0 : pointerY * .32;
  camera.style.transform = 'translate3d(' + (look.x + microX).toFixed(3) + '%, ' +
    (look.y + microY).toFixed(3) + '%, 0) scale(' + look.zoom.toFixed(4) + ')';
  highlights.style.opacity = look.glow.toFixed(3);
  shade.style.opacity = (1 - Math.min(.18,look.glow*.27)).toFixed(3);
  livingWorld.render(frameTime / 1000, smoothPosition);
  requestAnimationFrame(renderCamera);
}

if(image) {
  const loadOK = () => { warning.hidden = true; document.body.classList.add("asset-loaded"); };
  const loadError = () => { warning.hidden = false; document.body.classList.add("asset-missing"); };
  image.addEventListener("load", loadOK);
  image.addEventListener("error", loadError);
  if (image.complete) (image.naturalWidth ? loadOK : loadError)();
}

window.addEventListener("scroll", syncScroll, { passive:true });
window.addEventListener("resize", syncScroll, { passive:true });
window.addEventListener("pointermove", event => {
  if (reduced) return;
  pointerX = (event.clientX / window.innerWidth - .5) * 2;
  pointerY = (event.clientY / window.innerHeight - .5) * 2;
}, { passive:true });
window.addEventListener("load", syncScroll);
document.fonts?.ready?.then(syncScroll);
syncScroll(); smoothPosition = scrollTarget; requestAnimationFrame(renderCamera);

if (!reduced) {
  scenes.forEach(scene => {
    const targets = scene.querySelectorAll(".copy > *, .glass-stack, .problem-list, .feature-lineup, .improvement-columns, .notification-points, .resilience-panel");
    gsap.fromTo(targets, { y:22, opacity:0 }, {
      y:0, opacity:1, duration:.9, stagger:.06, ease:"power2.out",
      scrollTrigger: { trigger:scene, start:"top 85%", once:true }
    });
  });
}

// Direct access links from the original presentation are preserved in index.html.
// StrikeGuard and Keraunos description dialogs also preserve the original meaning.
const infoDialog = document.querySelector("#info-dialog");
const dialogHeading = document.querySelector("#dialog-heading");
const dialogText = document.querySelector("#dialog-text");
const details = {
  strikeguard: {
    title:"STRIKEGUARD",
    message:"Sistema reactivo: emite alertas cuando registra una descarga eléctrica nube–tierra."
  },
  keraunos: {
    title:"KERAUNOS",
    message:"Sistema predictivo: evalúa el umbral del campo electromagnético mediante el sensor físico y emite alertas ante una posible descarga eléctrica."
  }
};
document.querySelectorAll("[data-info]").forEach(button => button.addEventListener("click", () => {
  const item = details[button.dataset.info];
  if (!item || !infoDialog) return;
  dialogHeading.textContent = item.title;
  dialogText.textContent = item.message;
  if (typeof infoDialog.showModal === "function") infoDialog.showModal();
}));
document.querySelector("#close-info")?.addEventListener("click", () => infoDialog.close());
infoDialog?.addEventListener("click", e => { if (e.target === infoDialog) infoDialog.close(); });

// Faithful interactive fallback chain from original slide 06:
// Fail API -> activate all three engines -> fail all engines ->
// activate Keraunos manual -> fail it -> activate StrikeGuard manual.
const api = document.querySelector("#fail-api");
const motors = [...document.querySelectorAll("[data-motor]")];
const keraunos = document.querySelector("#fail-keraunos");
const strike = document.querySelector("#strike-final");
const status = document.querySelector("#sim-status");
const connectors = Object.fromEntries([...document.querySelectorAll("[data-link]")].map(el => [el.dataset.link,el]));
let fallback = {};
let simGeneration = 0;
function delayedActivation(node, delay) {
  const generation = simGeneration;
  if (reduced) activateNode(node);
  else gsap.delayedCall(delay, () => { if (generation === simGeneration) activateNode(node); });
}
function setStatus(message) { if (status) status.textContent = message; }
function failNode(node) { node.classList.remove("active"); node.classList.add("failed"); node.querySelector("small").textContent="FUERA DE SERVICIO"; if(node.tagName==="BUTTON")node.disabled=true; }
function activateNode(node){node.classList.add("active"); if(node.tagName==="BUTTON")node.disabled=false;}
function resetFallback() {
  simGeneration++;
  fallback = { api:false, motors:[false,false,false], keraunos:false };
  [api,...motors,keraunos,strike].forEach(node => {
    node.classList.remove("active","failed");
    node.querySelector("small").textContent = node===api ? "CLIC PARA FALLAR" : node===strike ? "ÚLTIMO RESPALDO" : "RESPALDO";
    if(node.tagName==="BUTTON")node.disabled=true;
  });
  Object.values(connectors).forEach(el => el.classList.remove("on","failed"));
  activateNode(api);
  setStatus("Haz clic en API para simular una falla y descubrir las capas de respaldo.");
}
api?.addEventListener("click", () => {
  if (fallback.api) return;
  fallback.api = true;
  failNode(api);
  connectors["api-motors"].classList.add("on");
  motors.forEach((motor,i) => {
    delayedActivation(motor, .18 + i*.21);
  });
  setStatus("API fuera de servicio. Motores 01, 02 y 03 disponibles: simula la falla de los tres.");
});
motors.forEach((motor,i) => motor.addEventListener("click", () => {
  if(!fallback.api || fallback.motors[i])return;
  fallback.motors[i]=true;
  failNode(motor);
  const count=fallback.motors.filter(Boolean).length;
  if(count===3){
    connectors["motors-keraunos"].classList.add("on");
    delayedActivation(keraunos, .35);
    setStatus("Los tres motores fallaron. El respaldo pasa a Keraunos manual.");
  }else setStatus(count+" de 3 motores fuera de servicio. Sigue probando los motores activos.");
}));
keraunos?.addEventListener("click", () => {
  if(!fallback.motors.every(Boolean) || fallback.keraunos)return;
  fallback.keraunos = true;
  failNode(keraunos);
  connectors["keraunos-strike"].classList.add("on");
  delayedActivation(strike, .35);
  setStatus("Keraunos manual fuera de servicio. Último respaldo: StrikeGuard manual.");
});
document.querySelector("#reset-sim")?.addEventListener("click", resetFallback);
resetFallback();
