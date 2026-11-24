import { gsap } from "gsap";
import { createLivingWorld, clamp01, smoothstep } from "./living-world.js";
import "./styles.css";

/**
 * V5 executive scrollytelling:
 * - Exactly six sections from the approved executive script.
 * - A persistent 2.5D mine camera that continuously interpolates.
 * - Reversible scroll-linked semantic graphic reveals (no discrete slide cuts).
 * - All external systems and original fallback simulator remain interactive.
 */
const camera = document.querySelector("#world-camera");
const highlights = document.querySelector(".world-highlights");
const shade = document.querySelector(".world-shade");
const image = document.querySelector("#mine-photo");
const warning = document.querySelector("#asset-warning");
const progress = document.querySelector("#progress-bar");
const scenes = [...document.querySelectorAll("[data-scene]")];
const navLinks = [...document.querySelectorAll("[data-nav]")];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const livingWorld = createLivingWorld({ reducedMotion: reduced });

const looks = [
  { x: 0,   y: 0,   zoom: 1.12, glow: .00 },
  { x: -2.2,y: -1.0,zoom: 1.22, glow: .05 },
  { x: -3.8,y: 1.2, zoom: 1.35, glow: .10 },
  { x: .8,  y: -.9, zoom: 1.42, glow: .18 },
  { x: 2.2, y: 1.6, zoom: 1.36, glow: .12 },
  { x: .3,  y: 0,   zoom: 1.23, glow: .04 }
];

const story = scenes.map(scene => ({
  scene,
  inner: scene.querySelector(".scene-inner"),
  beats: [...scene.querySelectorAll("[data-beat]")].map(el => ({
    el, start: Number(el.dataset.beat) || 0
  }))
}));
let storyTarget = 0, smoothPosition = 0, activeIndex = -1, pointerX = 0, pointerY = 0;
let elapsedScrollY = window.scrollY;
const mix = (a,b,t) => a + (b-a)*t;
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));

function getStoryPosition() {
  // Entire viewport is always filled: fixed chapter compositions are crossfaded
  // while the document scrolls through six 150svh narrative sections.
  const first = scenes[0]?.offsetTop || 0;
  const step = scenes[0]?.offsetHeight || window.innerHeight;
  return clamp((window.scrollY-first)/Math.max(1,step),0,scenes.length-1);
}

function sectionProgress(scene) {
  return clamp01((elapsedScrollY - scene.offsetTop)/Math.max(1,scene.offsetHeight));
}

function markActive(index) {
  if (index===activeIndex) return;
  activeIndex=index;
  navLinks.forEach((link,i) => {
    if(i===index)link.setAttribute("aria-current","step");
    else link.removeAttribute("aria-current");
  });
  document.body.dataset.chapter=String(index+1).padStart(2,"0");
}

function syncScroll() {
  elapsedScrollY = window.scrollY;
  storyTarget = getStoryPosition();
  const maxScroll = Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
  progress.style.width = (clamp01(elapsedScrollY/maxScroll)*100).toFixed(2)+"%";
  markActive(Math.min(looks.length-1,Math.floor(storyTarget+.5)));
}

function updateBeats() {
  // Fixed viewport layers enter/exit with crossfades near chapter boundaries.
  // Avoid scroll-jank blank intervals and preserve backwards scrubbing.
  for (let i=0;i<story.length;i++) {
    const group=story[i];
    const entering=i===0 ? 1 : smoothstep(i-.24,i,storyTarget);
    const exiting=i===story.length-1 ? 1 : 1-smoothstep(i+.76,i+1,storyTarget);
    const visibility=entering*exiting;
    group.inner.style.opacity=reduced ? (visibility>.5?"1":"0") : visibility.toFixed(3);
    group.inner.style.pointerEvents=visibility>.65?"auto":"none";
    group.inner.inert=visibility<.55;
    if(visibility<.005)continue;

    const phase=sectionProgress(group.scene);
    for (const beat of group.beats) {
      if(reduced){
        beat.el.style.opacity="1";beat.el.style.transform="none";beat.el.style.filter="none";
        continue;
      }
      const arrival=beat.start===0 ? 1 : smoothstep(beat.start,beat.start+.12,phase);
      beat.el.style.opacity=arrival.toFixed(3);
      beat.el.style.transform="translate3d(0,"+((1-arrival)*25).toFixed(1)+"px,0)";
      beat.el.style.filter=arrival<.999?"blur("+((1-arrival)*2.6).toFixed(2)+"px)":"none";
    }
  }
}

function renderCamera(frameTime=0) {
  smoothPosition = reduced ? storyTarget : mix(smoothPosition,storyTarget,.082);
  const lower=Math.min(looks.length-1,Math.floor(smoothPosition));
  const upper=Math.min(looks.length-1,lower+1);
  const a=looks[lower], b=looks[upper],t=smoothPosition-lower;
  const x=mix(a.x,b.x,t)+(reduced?0:pointerX*.38);
  const y=mix(a.y,b.y,t)+(reduced?0:pointerY*.28);
  const zoom=mix(a.zoom,b.zoom,t);
  const glow=mix(a.glow,b.glow,t);
  camera.style.transform="translate3d("+x.toFixed(3)+"%,"+y.toFixed(3)+"%,0) scale("+zoom.toFixed(4)+")";
  highlights.style.opacity=glow.toFixed(3);
  shade.style.opacity=(1-Math.min(.12,glow*.26)).toFixed(3);
  livingWorld.render(frameTime/1000,smoothPosition);
  updateBeats();
  requestAnimationFrame(renderCamera);
}

if(image){
  const okay=()=>{warning.hidden=true;document.body.classList.add("asset-loaded")};
  const missing=()=>{warning.hidden=false;document.body.classList.add("asset-missing")};
  image.addEventListener("load",okay);
  image.addEventListener("error",missing);
  if(image.complete)(image.naturalWidth?okay:missing)();
}
window.addEventListener("scroll",syncScroll,{passive:true});
window.addEventListener("resize",syncScroll,{passive:true});
window.addEventListener("hashchange",syncScroll);
window.addEventListener("pointermove",e=>{
  if(reduced)return;
  pointerX=(e.clientX/window.innerWidth-.5)*2;
  pointerY=(e.clientY/window.innerHeight-.5)*2;
},{passive:true});
window.addEventListener("load",syncScroll);
document.fonts?.ready?.then(syncScroll);
syncScroll();
smoothPosition=storyTarget;
requestAnimationFrame(renderCamera);

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
