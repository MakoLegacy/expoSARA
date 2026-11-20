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

const noiseFunctions = `
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += noise2(p) * a;
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}
float terrainHeight(vec2 p) {
  float r = length(p);
  float rim = 5.75 + (fbm(p * 0.24) - 0.5) * 0.34;
  float depth = max(rim - r, 0.0);
  float benches = floor(depth * 2.05);
  float pit = -0.12 - benches * 0.27 + (fbm(p * 0.7) - 0.5) * 0.11;
  float outer = 0.12 * sin(p.x * 0.58) * cos(p.y * 0.46) + (fbm(p * 0.42) - 0.5) * 0.32;
  float blend = 1.0 - smoothstep(rim - 0.08, rim + 0.12, r);
  return mix(outer, pit, blend);
}
`;

const vertexShader = `
uniform float uTime;
varying float vHeight;
varying float vRadius;
varying vec2 vLocal;
` + noiseFunctions + `
void main() {
  vec3 p = position;
  float h = terrainHeight(p.xz);
  float ripple = sin(p.x * 0.8 + uTime * 0.22) * cos(p.z * 0.7 - uTime * 0.18) * 0.025;
  p.y = h + ripple;
  vHeight = h;
  vRadius = length(p.xz);
  vLocal = p.xz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const surfaceFragment = `
varying float vHeight;
varying float vRadius;
varying vec2 vLocal;
void main() {
  float band = 1.0 - smoothstep(0.015, 0.08, abs(fract((vHeight + 4.0) * 2.2) - 0.5));
  float rimGlow = 1.0 - smoothstep(0.0, 1.0, abs(vRadius - 5.7));
  vec3 deep = vec3(0.018, 0.018, 0.021);
  vec3 earth = vec3(0.095, 0.038, 0.021);
  vec3 base = mix(deep, earth, smoothstep(-3.6, 0.2, vHeight));
  base += vec3(0.19, 0.052, 0.014) * band * 0.34;
  base += vec3(0.15, 0.035, 0.008) * rimGlow * 0.42;
  gl_FragColor = vec4(base, 1.0);
}
`;

const wireFragment = `
uniform float uTime;
varying float vHeight;
varying float vRadius;
varying vec2 vLocal;
void main() {
  float pulse = 0.5 + 0.5 * sin(uTime * 0.7 + vLocal.x * 0.18 + vLocal.y * 0.14);
  float rim = 1.0 - smoothstep(0.0, 1.4, abs(vRadius - 5.7));
  vec3 amber = vec3(1.0, 0.28, 0.075);
  vec3 gold = vec3(1.0, 0.62, 0.27);
  vec3 color = mix(amber, gold, clamp(rim * 0.65 + pulse * 0.18, 0.0, 1.0));
  gl_FragColor = vec4(color, 0.31 + pulse * 0.16 + rim * 0.16);
}
`;

function createTerrain() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x08090b, 0.025);

  camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(8.7, 8.8, 15.7);
  camera.lookAt(0, -0.8, 0);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  terrainGroup = new THREE.Group();
  terrainGroup.position.set(1.8, -0.78, -0.8);
  terrainGroup.rotation.y = -0.24;
  scene.add(terrainGroup);

  const geometry = new THREE.PlaneGeometry(23, 23, 170, 170);
  geometry.rotateX(-Math.PI / 2);
  const uniforms = { uTime: { value: 0 } };

  terrainMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader: surfaceFragment,
    side: THREE.DoubleSide
  });
  wireMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader: wireFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });

  const surface = new THREE.Mesh(geometry, terrainMaterial);
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wireMaterial);
  terrainGroup.add(surface, wire);

  const rimGeometry = new THREE.BufferGeometry();
  const rimPoints = [];
  for (let ring = 0; ring < 13; ring++) {
    const radius = 5.72 - ring * 0.43;
    const level = -0.12 - ring * 0.27;
    for (let i = 0; i <= 220; i++) {
      const angle = (i / 220) * Math.PI * 2;
      const rough = (Math.sin(angle * 5 + ring * 0.7) + Math.cos(angle * 9 - ring)) * 0.025;
      const r = radius + rough;
      rimPoints.push(Math.cos(angle) * r, level + 0.012, Math.sin(angle) * r);
    }
  }
  rimGeometry.setAttribute("position", new THREE.Float32BufferAttribute(rimPoints, 3));
  const contourMaterial = new THREE.LineBasicMaterial({
    color: 0xff8a4a,
    transparent: true,
    opacity: 0.36,
    blending: THREE.AdditiveBlending
  });
  const contourLines = new THREE.LineSegments(rimGeometry, contourMaterial);
  terrainGroup.add(contourLines);

  const particlePositions = [];
  for (let i = 0; i < 650; i++) {
    const x = (Math.random() - 0.5) * 26;
    const z = (Math.random() - 0.5) * 26;
    const y = (Math.random() * 5.5) - 2.1;
    particlePositions.push(x, y, z);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xff985b,
    size: 0.035,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const ambient = new THREE.AmbientLight(0xff8a4a, 0.4);
  const keyLight = new THREE.PointLight(0xff6b32, 38, 35);
  keyLight.position.set(-5, 7, 4);
  const rimLight = new THREE.PointLight(0xffc184, 24, 30);
  rimLight.position.set(7, 4, -8);
  scene.add(ambient, keyLight, rimLight);

  const floor = new THREE.GridHelper(32, 44, 0x6c321d, 0x3a2118);
  floor.position.y = -4.35;
  floor.material.transparent = true;
  floor.material.opacity = 0.15;
  scene.add(floor);
}

function moveToChapter(index) {
  const presets = [
    { x: 8.7, y: 8.8, z: 15.7, fx: 0, fy: -0.8, fz: 0, ry: -0.24 },
    { x: 10.8, y: 7.5, z: 13.5, fx: 0, fy: -1.0, fz: 0, ry: -0.1 },
    { x: 7.2, y: 5.4, z: 15.8, fx: 0, fy: -1.15, fz: 0, ry: 0.12 },
    { x: 4.8, y: 4.8, z: 12.5, fx: 0, fy: -1.5, fz: 0, ry: 0.32 },
    { x: 9.5, y: 6.0, z: 15.2, fx: 0, fy: -0.9, fz: 0, ry: -0.28 },
    { x: 11.4, y: 7.3, z: 14.2, fx: 0, fy: -0.8, fz: 0, ry: -0.45 },
    { x: 7.5, y: 5.4, z: 12.8, fx: 0, fy: -1.5, fz: 0, ry: 0.2 }
  ];
  const preset = presets[index] || presets[0];
  if (!camera || !terrainGroup) return;
  gsap.to(camera.position, { x: preset.x, y: preset.y, z: preset.z, duration: reducedMotion ? 0 : 1.6, ease: "power3.inOut" });
  gsap.to(focusTarget, { x: preset.fx, y: preset.fy, z: preset.fz, duration: reducedMotion ? 0 : 1.6, ease: "power3.inOut" });
  gsap.to(terrainGroup.rotation, { y: preset.ry, duration: reducedMotion ? 0 : 1.8, ease: "power3.inOut" });
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
    camera.position.x += pointer.smoothX * 0.16;
    camera.position.y += pointer.smoothY * 0.08;
    camera.lookAt(focusTarget);
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

setActiveChapter(0);
