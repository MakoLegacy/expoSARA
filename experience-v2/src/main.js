import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

function renderCamera() {
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

// Progressive continuity demonstration shared with preview V5.
// API Keraunos is a proposed primary integration; existing web engines share its source.
const api=document.querySelector("#fail-api");
const motors=[...document.querySelectorAll("[data-motor]")];
const keraunos=document.querySelector("#fail-keraunos");
const strike=document.querySelector("#strike-final");
const status=document.querySelector("#sim-status");
const backupTrack=document.querySelector("#fallback-sim");
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
