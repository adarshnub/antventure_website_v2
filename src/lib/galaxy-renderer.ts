import * as THREE from "three";

// All stars share a geometry and shader. Scroll/cursor change uniforms, not buffers.
const vertexShader = `
  uniform float uTime;
  uniform float uExplosion;
  uniform float uRatio;
  uniform float uPointerStrength;
  uniform float uPulse;
  uniform vec2 uPointer;
  attribute vec3 aScatter;
  attribute float aSize;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vLight;
  void main() {
    vec3 p = position + aScatter * uExplosion;
    float orbit = uTime * 0.018 / (0.7 + length(position.xz) * 0.24);
    p.xz = mat2(cos(orbit), -sin(orbit), sin(orbit), cos(orbit)) * p.xz;
    vec4 view = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * view;
    vec2 screen = clip.xy / clip.w;
    vec2 delta = screen - uPointer;
    float distanceToCursor = length(delta);
    float influence = exp(-distanceToCursor * distanceToCursor * 12.0) * uPointerStrength;
    // A tangential gravity disturbance gives stars a fluid swirl, not a hard shove.
    view.xy += (vec2(-delta.y, delta.x) * 0.65 - delta * 0.22) * influence;
    view.xy += normalize(delta + vec2(0.001)) * uPulse * influence * 0.55;
    gl_Position = projectionMatrix * view;
    gl_PointSize = clamp(aSize * uRatio * (14.0 / max(3.0, -view.z)) * (1.0 + influence * 0.7), 0.7, 16.0);
    vColor = color;
    vLight = (0.76 + 0.24 * sin(aSeed * 120.0 + uTime * (0.6 + aSeed))) * (1.0 + influence * 0.7);
  }
`;
const fragmentShader = `
  varying vec3 vColor;
  varying float vLight;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float core = exp(-r * r * 16.0);
    float halo = exp(-r * r * 4.0) * 0.26;
    float alpha = (core + halo) * (1.0 - smoothstep(0.72, 1.0, r));
    gl_FragColor = vec4(vColor * vLight, alpha * 0.88);
  }
`;

type View = { x: number; y: number; tilt: number; roll: number; scale: number; explosion: number };
const views: View[] = [
  { x: 3.25, y: 0.25, tilt: 0.72, roll: -0.38, scale: 1, explosion: 0 },
  { x: 2.8, y: 0.3, tilt: 0.35, roll: 0.18, scale: 0.82, explosion: 1 },
  { x: 2.7, y: 0.3, tilt: 1.02, roll: 0.35, scale: 0.9, explosion: 0.35 },
  { x: 3.1, y: 0, tilt: 0.58, roll: 0.65, scale: 0.9, explosion: 0 },
  { x: 2.6, y: 0.5, tilt: 0.35, roll: 0.8, scale: 1, explosion: 0.8 },
  { x: -2.1, y: 0, tilt: 0.8, roll: 1.1, scale: 1.05, explosion: 0.35 },
  { x: 2.5, y: 0.4, tilt: 0.52, roll: 1.45, scale: 0.92, explosion: 0.15 },
  { x: -2.7, y: 0.5, tilt: 0.95, roll: 1.75, scale: 0.9, explosion: 0 },
  { x: 2.1, y: 0.2, tilt: 0.32, roll: 2.1, scale: 1, explosion: 0.6 },
  { x: 0, y: 0, tilt: 0.7, roll: 2.35, scale: 1.05, explosion: 0.8 },
  { x: -2.6, y: 0, tilt: 1.05, roll: 2.6, scale: 0.85, explosion: 0.4 },
  { x: 2.5, y: 0, tilt: 0.5, roll: 2.9, scale: 1, explosion: 0.2 },
  { x: 0, y: 0.3, tilt: 0.7, roll: 3.2, scale: 1.25, explosion: 0 },
];

export function createGalaxy(canvas: HTMLCanvasElement, main: HTMLElement) {
  const compact = matchMedia("(max-width: 820px)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const lowPower = compact.matches || (navigator.hardwareConcurrency || 8) <= 4 || connection?.saveData;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power", stencil: false });
  renderer.setClearColor(0x020610, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 65);
  camera.position.z = 14;
  const group = new THREE.Group();
  scene.add(group);
  let seed = 7193;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 4294967296; };
  const count = lowPower ? 10000 : 30000;
  const positions = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  const inside = new THREE.Color("#ffe2b2");
  const middle = new THREE.Color("#74e6ee");
  const outside = new THREE.Color("#697edb");
  const starColor = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const r = Math.pow(random(), 1.6) * 5.4 + 0.025;
    const arm = i % 4;
    const spread = Math.pow(random(), 2.5) * (random() < 0.5 ? -1 : 1);
    const angle = arm * Math.PI * 0.5 + r * 1.12 + spread * 0.95;
    const thickness = (random() + random() + random() - 1.5) * (0.06 + r * 0.045);
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = thickness;
    positions[i * 3 + 2] = Math.sin(angle) * r;
    // Separate arms into floating strata as visitors move through the story.
    scatter[i * 3] = Math.cos(angle) * (0.4 + r * 0.28);
    scatter[i * 3 + 1] = (arm - 1.5) * 1.25 + thickness * 4;
    scatter[i * 3 + 2] = Math.sin(angle) * (0.4 + r * 0.28);
    starColor.copy(inside).lerp(middle, Math.min(1, r / 2.1));
    if (r > 2.1) starColor.lerp(outside, (r - 2.1) / 3.3);
    if (random() > 0.985) starColor.set("#ffffff");
    starColor.multiplyScalar(0.65 + random() * 0.65);
    starColor.toArray(colors, i * 3);
    sizes[i] = random() > 0.985 ? 5 + random() * 3 : 1.2 + random() * 1.8;
    seeds[i] = random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const uniforms = {
    uTime: { value: 0 }, uExplosion: { value: 0 }, uRatio: { value: 1 },
    uPointer: { value: new THREE.Vector2(9, 9) }, uPointerStrength: { value: 0 }, uPulse: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const stars = new THREE.Points(geometry, material);
  stars.frustumCulled = false;
  group.add(stars);

  // A separate, low-density star field supplies parallax at a different depth.
  const fieldCount = lowPower ? 400 : 1200;
  const fieldPositions = new Float32Array(fieldCount * 3);
  for (let i = 0; i < fieldCount; i++) {
    fieldPositions[i * 3] = (random() - 0.5) * 48;
    fieldPositions[i * 3 + 1] = (random() - 0.5) * 28;
    fieldPositions[i * 3 + 2] = -3 - random() * 16;
  }
  const fieldGeometry = new THREE.BufferGeometry();
  fieldGeometry.setAttribute("position", new THREE.BufferAttribute(fieldPositions, 3));
  const fieldMaterial = new THREE.PointsMaterial({ color: "#aac8ed", size: 0.024, transparent: true, opacity: 0.6, depthWrite: false });
  const field = new THREE.Points(fieldGeometry, fieldMaterial);
  scene.add(field);

  let stops: number[] = [];
  let targetJourney = 0;
  let journey = 0;
  let elapsed = 0;
  let previousTime = 0;
  let lastRender = 0;
  let paused = reduced.matches;
  let lost = false;
  let inView = true;
  let disposed = false;
  let pointerActive = false;
  let slowFrames = 0;
  let ratio = Math.min(devicePixelRatio || 1, lowPower ? 1.15 : 1.5);
  const pointer = new THREE.Vector2(0, 0);
  const easedPointer = new THREE.Vector2(0, 0);

  function measure() {
    const hero = main.querySelector<HTMLElement>(".hero-scroll");
    const start = main.getBoundingClientRect().top + scrollY;
    const heroDistance = Math.max(1, (hero?.offsetHeight || innerHeight * 4) - innerHeight);
    stops = [start, start + heroDistance * 0.3, start + heroDistance * 0.6, start + heroDistance * 0.87];
    main.querySelectorAll<HTMLElement>("[data-galaxy-stop]").forEach((section) => {
      stops.push(section.getBoundingClientRect().top + scrollY - innerHeight * 0.25);
    });
    updateScroll();
  }
  function updateScroll() {
    let index = 0;
    while (index < stops.length - 2 && scrollY >= stops[index + 1]) index++;
    const part = THREE.MathUtils.clamp((scrollY - stops[index]) / Math.max(1, stops[index + 1] - stops[index]), 0, 1);
    targetJourney = Math.min(views.length - 1, index + part);
  }
  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(ratio);
    renderer.setSize(innerWidth, innerHeight, false);
    uniforms.uRatio.value = ratio;
    measure();
    if (paused && !lost) render(0, true);
  }
  function render(time: number, still = false) {
    if (disposed || lost) return;
    if (!still && time - lastRender < (lowPower ? 1000 / 30 : 1000 / 60) - 1) return;
    const dt = still ? 0 : Math.min(0.05, (time - (previousTime || time)) / 1000);
    previousTime = time;
    if (!still && !lowPower && time - lastRender > 29) slowFrames++; else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 90 && ratio > 1) {
      ratio = 1;
      renderer.setPixelRatio(ratio);
      renderer.setSize(innerWidth, innerHeight, false);
      uniforms.uRatio.value = ratio;
      slowFrames = 0;
    }
    lastRender = time;
    elapsed += dt;
    const easing = still ? 1 : 1 - Math.exp(-dt * 5);
    journey += (targetJourney - journey) * easing;
    easedPointer.lerp(pointer, easing);
    const index = Math.min(views.length - 2, Math.floor(journey));
    const mix = THREE.MathUtils.smoothstep(journey - index, 0, 1);
    const from = views[index];
    const to = views[index + 1];
    const lerp = THREE.MathUtils.lerp;
    group.position.set(lerp(from.x, to.x, mix) * (compact.matches ? 0.28 : camera.aspect / 1.85), compact.matches ? 2 : lerp(from.y, to.y, mix), 0);
    group.rotation.set(lerp(from.tilt, to.tilt, mix) + easedPointer.y * 0.08, elapsed * 0.025 + easedPointer.x * 0.08, lerp(from.roll, to.roll, mix));
    group.scale.setScalar(lerp(from.scale, to.scale, mix) * (compact.matches ? 0.63 : 1));
    uniforms.uExplosion.value = lerp(from.explosion, to.explosion, mix);
    uniforms.uTime.value = elapsed;
    uniforms.uPointer.value.copy(easedPointer);
    uniforms.uPointerStrength.value = lerp(uniforms.uPointerStrength.value, pointerActive ? 1 : 0, easing);
    uniforms.uPulse.value *= Math.exp(-dt * 3);
    field.rotation.y = easedPointer.x * 0.018 + journey * 0.025;
    field.rotation.x = easedPointer.y * 0.012;
    renderer.render(scene, camera);
    canvas.dataset.ready = "true";
    // Exposed on the canvas for QA without retaining scene references globally.
    canvas.dataset.drawCalls = String(renderer.info.render.calls);
    canvas.dataset.particles = String(count + fieldCount);
  }
  function updateLoop() {
    renderer.setAnimationLoop(null);
    previousTime = 0;
    if (!paused && !document.hidden && inView && !lost && !disposed) renderer.setAnimationLoop((time) => render(time));
    canvas.dataset.motion = paused ? "paused" : "running";
  }
  function move(event: PointerEvent) {
    if (paused || event.pointerType === "touch") return;
    pointer.set(event.clientX / innerWidth * 2 - 1, 1 - event.clientY / innerHeight * 2);
    pointerActive = true;
  }
  function leave() { pointerActive = false; pointer.set(0, 0); }
  function pulse(event: PointerEvent) {
    if (paused || (event.target instanceof Element && event.target.closest("a,button,input,select,textarea"))) return;
    move(event);
    uniforms.uPulse.value = 1;
  }
  function contextLost(event: Event) { event.preventDefault(); lost = true; canvas.dataset.ready = "false"; updateLoop(); }
  function contextRestored() { lost = false; resize(); updateLoop(); }
  function motionChanged() { paused = reduced.matches; if (paused) render(0, true); updateLoop(); }
  const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; updateLoop(); });
  observer.observe(main);
  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(main);
  window.addEventListener("resize", resize);
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("pointerdown", pulse, { passive: true });
  document.documentElement.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", updateLoop);
  reduced.addEventListener("change", motionChanged);
  canvas.addEventListener("webglcontextlost", contextLost);
  canvas.addEventListener("webglcontextrestored", contextRestored);
  resize();
  render(0, true);
  updateLoop();
  return {
    setPaused(value: boolean) { paused = value; updateLoop(); },
    dispose() {
      disposed = true;
      renderer.setAnimationLoop(null);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", pulse);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", updateLoop);
      reduced.removeEventListener("change", motionChanged);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      geometry.dispose(); material.dispose(); fieldGeometry.dispose(); fieldMaterial.dispose();
      renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
