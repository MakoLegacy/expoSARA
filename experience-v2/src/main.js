import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector("#terrain");
const progress = document.querySelector("#progress");
const readout = document.querySelector("#readout");
const navDots = [...document.querySelectorAll(".rail-dot")];
const chapters = [...document.querySelectorAll(".chapter")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setActiveChapter = (index) => {
  navDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
    if (dotIndex === index) dot.setAttribute("aria-current", "step");
    else dot.removeAttribute("aria-current");
  });
  if (readout) readout.textContent = "SECTOR " + String(index).padStart(2, "0");
};

navDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const target = document.getElementById(dot.dataset.target);
    if (target) target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  });
});

let renderer;
let scene;
let camera;
let terrainMaterial;
let wireMaterial;
let terrainGroup;
let particles;
let focusTarget = new THREE.Vector3(0, -0.7, 0);
const pointer = { x: 0, y: 0, smoothX: 0, smoothY: 0 };


const reducedMotionFactor = reducedMotion ? 0 : 1;
const shaderCommon = `
uniform float uTime;
uniform float uDigital;
varying vec3 vWorld;
varying float vHeight;
varying float vBench;
varying float vSlope;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=noise(p)*a;p*=2.03;a*=.5;}return v;}
float heightAt(vec2 p){
 vec2 q=p+vec2(.36*sin(p.y*.25),.24*cos(p.x*.31));
 float r=length(q*vec2(.91,1.07));
 float jag=(fbm(q*.48)-.5)*.48 + sin(atan(q.y,q.x)*13.)*.07;
 float radius=r+jag;
 float depth=max(0.,6.6-radius);
 float bench=floor(depth*1.8);
 float local=fract(depth*1.8);
 float terrace=bench*.36 + smoothstep(.76,.97,local)*.36;
 float pit=-terrace;
 float outer= .26*fbm(p*.42)+.12*sin(p.x*.45)*cos(p.y*.6);
 float core=mix(pit,outer,smoothstep(6.4,6.85,radius));
 return core+(fbm(p*2.7)-.5)*.055;
}
`;
const terrainVertex = shaderCommon + `
void main(){
 vec3 p=position;
 float h=heightAt(p.xz);
 p.y=h;
 vHeight=h;
 vWorld=p;
 vBench=fract(max(0.,6.6-length(p.xz))*1.8);
 float a=heightAt(p.xz+vec2(.045,0.));
 float b=heightAt(p.xz+vec2(0.,.045));
 vSlope=clamp(length(vec2(a-h,b-h))/.045,0.,1.);
 gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`;
const terrainFragment = shaderCommon + `
void main(){
 float stone=fbm(vWorld.xz*2.8),grit=noise(vWorld.xz*14.);
 float strata=sin(vHeight*31.+stone*4.)*.07;
 vec3 rock=mix(vec3(.13,.104,.087),vec3(.32,.235,.17),stone);
 rock+=strata+grit*.045;
 float light=clamp(.66+vSlope*.35+sin(vWorld.x*.25)*.12,0.,1.);
 rock*=light;
 float contour=1.-smoothstep(.015,.09,abs(fract(vHeight*2.7)-.5));
 float gridX=1.-smoothstep(.012,.045,abs(fract(vWorld.x*.45)-.5));
 float gridZ=1.-smoothstep(.012,.045,abs(fract(vWorld.z*.45)-.5));
 float scan=.55+.45*sin(uTime*1.4-vWorld.x*.35);
 vec3 digital=vec3(.012,.055,.072)+vec3(.01,.22,.29)*max(gridX,gridZ)*.48+vec3(.06,.65,.84)*contour*(.45+.55*scan);
 vec3 color=mix(rock,digital,uDigital);
 float ember=(1.-smoothstep(.0,.065,abs(fract(vHeight*2.7)-.5)))*uDigital;
 color+=vec3(1.,.19,.045)*ember*.23;
 gl_FragColor=vec4(color,1.);
}`;
const lineFragment = shaderCommon + `
void main(){
 float scan=.55+.45*sin(uTime*1.4+vWorld.x*.4);
 vec3 c=mix(vec3(.5,.27,.13),vec3(.03,.7,.94),uDigital);
 gl_FragColor=vec4(c,(.06+.34*uDigital)*scan);
}`;
function createTerrain(){
 scene=new THREE.Scene();
 scene.background=new THREE.Color(0x070b10);
 scene.fog=new THREE.FogExp2(0x070b10,.027);
 camera=new THREE.PerspectiveCamera(46,innerWidth/innerHeight,.1,110);
 camera.position.set(11.5,9.3,18.5);
 camera.lookAt(0,-.8,0);
 renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));
 renderer.setSize(innerWidth,innerHeight);
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.22;
 terrainGroup=new THREE.Group();
 terrainGroup.position.set(3.4,-.55,-1.3);
 terrainGroup.rotation.y=-.24;
 scene.add(terrainGroup);
 const geometry=new THREE.PlaneGeometry(25,25,240,240);
 geometry.rotateX(-Math.PI/2);
 const uniforms={uTime:{value:0},uDigital:{value:0}};
 terrainMaterial=new THREE.ShaderMaterial({uniforms,vertexShader:terrainVertex,fragmentShader:terrainFragment,side:THREE.DoubleSide});
 wireMaterial=new THREE.ShaderMaterial({uniforms,vertexShader:terrainVertex,fragmentShader:lineFragment,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
 const rock=new THREE.Mesh(geometry,terrainMaterial);
 const grid=new THREE.LineSegments(new THREE.WireframeGeometry(geometry),wireMaterial);
 grid.position.y=.012;
 terrainGroup.add(rock,grid);
 const rampPoints=[];
 // A descending spiral haul-road, separate from the terraced rock surface.
 for(let i=0;i<=320;i++){
   const t=i/320,angle=t*Math.PI*4.1+.5,radius=6.3-t*4.8;
   const x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;
   const y=-Math.floor((6.6-radius)*1.8)*.36+.09;
   rampPoints.push(new THREE.Vector3(x,y,z));
 }
 const road=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rampPoints),460,.065,5,false),new THREE.MeshStandardMaterial({color:0xb39468,roughness:1}));
 road.name="haulRoad";
 terrainGroup.add(road);
 const points=[];
 for(let i=0;i<470;i++)points.push((Math.random()-.5)*27,Math.random()*5-1.5,(Math.random()-.5)*27);
 const pg=new THREE.BufferGeometry();
 pg.setAttribute("position",new THREE.Float32BufferAttribute(points,3));
 particles=new THREE.Points(pg,new THREE.PointsMaterial({color:0xd9a16c,size:.035,transparent:true,opacity:.38,depthWrite:false}));
 scene.add(particles);
 scene.add(new THREE.HemisphereLight(0x9ab7d4,0x24120d,2.2));
 const sun=new THREE.DirectionalLight(0xffb778,3.1);
 sun.position.set(-6,13,7);
 scene.add(sun);
 const fill=new THREE.DirectionalLight(0x4db9ed,1.5);
 fill.position.set(8,5,-10);
 scene.add(fill);
 const gridFloor=new THREE.GridHelper(34,34,0x17465a,0x123042);
 gridFloor.position.y=-5;
 gridFloor.material.transparent=true;
 gridFloor.material.opacity=.22;
 scene.add(gridFloor);
}
function moveToChapter(index) {
  const presets = [
    { x: 11.5, y: 9.3, z: 18.5, fx: 1.2, fy: -1.0, fz: 0, ry: -.24, digital: 0 },
    { x: 10.8, y: 7.7, z: 15.3, fx: 1.2, fy: -1.0, fz: 0, ry: -.08, digital: 0 },
    { x: 8.3, y: 5.7, z: 12.9, fx: 1.1, fy: -1.5, fz: 0, ry: .18, digital: .13 },
    { x: 7.2, y: 7.5, z: 13.2, fx: 1.0, fy: -1.4, fz: 0, ry: .4, digital: 1 },
    { x: 10.2, y: 7.2, z: 15.5, fx: 1.0, fy: -1.1, fz: 0, ry: .02, digital: 1 },
    { x: 9.4, y: 5.6, z: 13.6, fx: 1.0, fy: -1.4, fz: 0, ry: -.2, digital: 1 },
    { x: 11.5, y: 10.4, z: 17.6, fx: 1.0, fy: -1.0, fz: 0, ry: -.5, digital: 1 }
  ];
  const preset = presets[index] || presets[0];
  if (!camera || !terrainGroup) return;
  gsap.to(camera.position, { x: preset.x, y: preset.y, z: preset.z, duration: reducedMotion ? 0 : 1.6, ease: "power3.inOut" });
  gsap.to(focusTarget, { x: preset.fx, y: preset.fy, z: preset.fz, duration: reducedMotion ? 0 : 1.6, ease: "power3.inOut" });
  gsap.to(terrainGroup.rotation, { y: preset.ry, duration: reducedMotion ? 0 : 1.8, ease: "power3.inOut" });
  if (terrainMaterial) gsap.to(terrainMaterial.uniforms.uDigital, {value:preset.digital,duration:reducedMotion?0:1.8,ease:"power2.inOut"});
  if (index > 0 && document.body.classList.contains("preview-digital")) setPreviewDigital(false);
  document.body.classList.toggle("digital-mode",index>=3);
  setActiveChapter(index);
}

function setupScrollExperience() {
  chapters.forEach((chapter, index) => {
    ScrollTrigger.create({
      trigger: chapter,
      start: "top 55%",
      end: "bottom 45%",
      onEnter: () => moveToChapter(index),
      onEnterBack: () => moveToChapter(index),
      onUpdate: (self) => {
        const overall = ScrollTrigger.maxScroll(window) || 1;
        const current = window.scrollY / overall;
        progress.style.width = Math.max(0, Math.min(100, current * 100)) + "%";
      }
    });
    const revealTargets = chapter.querySelectorAll(".eyebrow, h1, h2, .hero-description, .lead, .data-card, .issue-card, .capability-card, .comparison-card, .notification-list article, .resilience-card");
    if (!reducedMotion && revealTargets.length) {
      gsap.fromTo(revealTargets,
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: { trigger: chapter, start: "top 72%", once: true }
        }
      );
    }
  });
  ScrollTrigger.create({trigger:document.body,start:"top top",end:"bottom bottom",onUpdate:self=>{progress.style.width=(self.progress*100).toFixed(2)+"%";}});
  ScrollTrigger.refresh();
}

function onResize() {
  if (!renderer || !camera) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(time) {
  if (terrainMaterial && wireMaterial) {
    const t = time * 0.001;
    terrainMaterial.uniforms.uTime.value = t;
    wireMaterial.uniforms.uTime.value = t;
  }
  pointer.smoothX += (pointer.x - pointer.smoothX) * 0.035;
  pointer.smoothY += (pointer.y - pointer.smoothY) * 0.035;
  if (camera) {
    // Parallax is applied to the look target, not cumulatively to the camera position.
    camera.lookAt(
      focusTarget.x + pointer.smoothX * 0.42,
      focusTarget.y + pointer.smoothY * 0.2,
      focusTarget.z
    );
  }
  if (particles) particles.rotation.y = time * 0.000012;
  if (renderer && scene && camera) renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

try {
  if (!canvas || !window.WebGLRenderingContext) throw new Error("WebGL no está disponible en este navegador.");
  createTerrain();
  setupScrollExperience();
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  requestAnimationFrame(animate);
} catch (error) {
  console.error("S.A.R.A. Experience:", error);
  document.body.classList.add("no-webgl");
  if (readout) readout.textContent = "3D NO DISPONIBLE";
}


/* Photo-to-digital-twin experience.
   Image is a visual concept asset, not a live photograph or operational map. */
const photoStage = document.getElementById("photo-stage");
const photoImage = document.getElementById("mine-photo");
const modeButton = document.getElementById("hero-mode-toggle");
function setPreviewDigital(active) {
  if (!modeButton) return;
  document.body.classList.toggle("preview-digital", active);
  modeButton.classList.toggle("is-active", active);
  modeButton.setAttribute("aria-pressed", String(active));
  modeButton.innerHTML = active ? "VER MINA REALISTA <span>↙</span>" : "VER GEMELO DIGITAL <span>↗</span>";
  if (terrainMaterial) gsap.to(terrainMaterial.uniforms.uDigital, {
    value: active ? 1 : 0,
    duration: reducedMotion ? 0 : .85,
    overwrite: "auto"
  });
}
function preparePhotoExperience() {
  if (!photoStage || !photoImage) return;
  const ready = () => document.body.classList.add("has-photo");
  const failed = () => {
    photoStage.style.visibility = "hidden";
    document.body.classList.remove("has-photo");
    console.warn("La fotografía de portada no está en public/assets/antamina-cinematic.webp; usando el 3D.");
  };
  photoImage.addEventListener("load", ready, { once: true });
  photoImage.addEventListener("error", failed, { once: true });
  if (photoImage.complete) {
    if (photoImage.naturalWidth) ready();
    else failed();
  }
  modeButton?.addEventListener("click", () => setPreviewDigital(!document.body.classList.contains("preview-digital")));
  if (reducedMotion) return;
  // Slight continuous parallax provides movement without treating the photograph as real 3D.
  gsap.to(photoImage, {
    scale: 1.14, xPercent: -2.7, ease: "none",
    scrollTrigger: { trigger: "#inicio", start: "top top", end: "#capitulo-03 top", scrub: .8 }
  });
  gsap.fromTo(photoStage, { opacity: 1 }, {
    opacity: 0, ease: "none",
    scrollTrigger: { trigger: "#capitulo-03", start: "top 100%", end: "top 35%", scrub: .8 }
  });
}
preparePhotoExperience();

setActiveChapter(0);
