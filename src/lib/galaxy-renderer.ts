import * as THREE from "three";

// All stars share a geometry and shader. Scroll/cursor change uniforms, not buffers.
const vertexShader = `
  uniform float uTime;
  uniform float uExplosion;
  uniform float uShape;
  uniform float uRatio;
  uniform float uPointerStrength;
  uniform vec2 uWake;
  uniform vec2 uPointer;
  attribute vec3 aScatter;
  attribute vec3 aRing;
  attribute vec3 aHelix;
  attribute vec3 aConstellation;
  attribute float aSize;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vLight;
  void main() {
    vec3 p = mix(position, aRing, smoothstep(0.0, 1.0, uShape));
    p = mix(p, aHelix, smoothstep(1.0, 2.0, uShape));
    p = mix(p, aConstellation, smoothstep(2.0, 3.0, uShape));
    p += aScatter * uExplosion;
    p.y += sin(uTime * 0.65 + aSeed * 6.28 + length(p.xz)) * 0.09;
    float orbit = uTime * 0.055 / (0.7 + length(position.xz) * 0.24);
    p.xz = mat2(cos(orbit), -sin(orbit), sin(orbit), cos(orbit)) * p.xz;
    vec4 view = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * view;
    vec2 screen = clip.xy / clip.w;
    vec2 delta = screen - uPointer;
    float distanceToCursor = length(delta);
    float influence = exp(-distanceToCursor * distanceToCursor * 12.0) * uPointerStrength;
    // A tangential gravity disturbance gives stars a fluid swirl, not a hard shove.
    view.xy += (vec2(-delta.y, delta.x) * 0.8 - delta * 0.28 + uWake * 1.8) * influence;
    gl_Position = projectionMatrix * view;
    gl_PointSize = clamp(aSize * uRatio * (14.0 / max(3.0, -view.z)) * (1.0 + influence * 0.5), 1.5, 18.0);
    vColor = color;
    vLight = (0.76 + 0.24 * sin(aSeed * 120.0 + uTime * (0.6 + aSeed))) * (1.0 + influence * 0.7);
  }
`;
const fragmentShader = `
  varying vec3 vColor;
  varying float vLight;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float core = 1.0 - smoothstep(0.08, 0.42, r);
    float halo = exp(-r * r * 5.0) * 0.22;
    float alpha = (core + halo) * (1.0 - smoothstep(0.72, 1.0, r));
    gl_FragColor = vec4(vColor * vLight, alpha * 0.88);
  }
`;

type View = { x: number; y: number; tilt: number; roll: number; scale: number; explosion: number; shape: number };
const views: View[] = [
  { x: 3.25, y: 0.25, tilt: 0.72, roll: -0.38, scale: 1, explosion: 0, shape: 0 },
  { x: 2.8, y: 0.3, tilt: 0.35, roll: 0.18, scale: 0.82, explosion: 1.3, shape: 0 },
  { x: 2.7, y: 0.3, tilt: 1.02, roll: 0.35, scale: 0.9, explosion: 0, shape: 1 },
  { x: 3.1, y: 0, tilt: 0.58, roll: 0.65, scale: 0.9, explosion: 0, shape: 0 },
  { x: 2.6, y: 0.5, tilt: 0.35, roll: 0.8, scale: 1, explosion: 0.15, shape: 3 },
  { x: -2.1, y: 0, tilt: 0.3, roll: 0.25, scale: 0.85, explosion: 0, shape: 2 },
  { x: 2.5, y: 0.4, tilt: 0.52, roll: 1.45, scale: 0.92, explosion: 0, shape: 1 },
  { x: -2.7, y: 0.5, tilt: 0.95, roll: 1.75, scale: 0.9, explosion: 0, shape: 0 },
  { x: 2.1, y: 0.2, tilt: 0.32, roll: 0.3, scale: 0.9, explosion: 0, shape: 2 },
  { x: 0, y: 0, tilt: 0.7, roll: 2.35, scale: 1.05, explosion: 0.2, shape: 3 },
  { x: -2.6, y: 0, tilt: 1.05, roll: 2.6, scale: 0.85, explosion: 0, shape: 1 },
  { x: 2.5, y: 0, tilt: 0.5, roll: 2.9, scale: 1, explosion: 0.2, shape: 3 },
  { x: 0, y: 0.3, tilt: 0.7, roll: 3.2, scale: 1.25, explosion: 0, shape: 0 },
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
  const ring = new Float32Array(count * 3);
  const helix = new Float32Array(count * 3);
  const constellation = new Float32Array(count * 3);
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
    const theta = random() * Math.PI * 2;
    const tube = random() * Math.PI * 2;
    const tubeRadius = 0.3 + random() * 0.24;
    ring[i * 3] = (3.1 + Math.cos(tube) * tubeRadius) * Math.cos(theta);
    ring[i * 3 + 1] = Math.sin(tube) * tubeRadius;
    ring[i * 3 + 2] = (3.1 + Math.cos(tube) * tubeRadius) * Math.sin(theta);
    const h = random() * 8 - 4;
    const strand = h * 1.4 + (i % 2) * Math.PI;
    helix[i * 3] = Math.cos(strand) * 1.6 + thickness;
    helix[i * 3 + 1] = h;
    helix[i * 3 + 2] = Math.sin(strand) * 1.6 + thickness;
    const cluster = i % 3;
    const phi = Math.acos(random() * 2 - 1);
    const clusterSize = Math.pow(random(), 0.65) * (1.2 - cluster * 0.16);
    constellation[i * 3] = (cluster - 1) * 3 + Math.sin(phi) * Math.cos(theta) * clusterSize;
    constellation[i * 3 + 1] = Math.cos(phi) * clusterSize + Math.sin(cluster * 2) * 0.6;
    constellation[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * clusterSize;
    starColor.copy(inside).lerp(middle, Math.min(1, r / 2.1));
    if (r > 2.1) starColor.lerp(outside, (r - 2.1) / 3.3);
    if (random() > 0.985) starColor.set("#ffffff");
    starColor.multiplyScalar(0.65 + random() * 0.65);
    starColor.toArray(colors, i * 3);
    sizes[i] = random() > 0.985 ? 4 + random() * 3 : 1.5 + random() * 1.8;
    seeds[i] = random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
  geometry.setAttribute("aRing", new THREE.BufferAttribute(ring, 3));
  geometry.setAttribute("aHelix", new THREE.BufferAttribute(helix, 3));
  geometry.setAttribute("aConstellation", new THREE.BufferAttribute(constellation, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  const uniforms = {
    uTime: { value: 0 }, uExplosion: { value: 0 }, uShape: { value: 0 }, uRatio: { value: 1 },
    uPointer: { value: new THREE.Vector2(9, 9) }, uPointerStrength: { value: 0 }, uWake: { value: new THREE.Vector2() },
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
  const fieldMaterial = new THREE.ShaderMaterial({
    uniforms: { uRatio: uniforms.uRatio }, transparent: true, depthWrite: false,
    vertexShader: `uniform float uRatio; varying vec3 vColor; varying float vLight;
      void main() { vec4 view = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * view; gl_PointSize = clamp(45.0 / -view.z, 1.2, 3.0) * uRatio;
      vColor = vec3(0.52, 0.69, 0.89); vLight = 0.68; }`,
    fragmentShader,
  });
  const field = new THREE.Points(fieldGeometry, fieldMaterial);
  scene.add(field);

  // Six flowing comet tails in one buffer; motion is calculated entirely on the GPU.
  const tailCount = lowPower ? 144 : 288;
  const tailPositions = new Float32Array(tailCount * 3);
  const tailSegments = tailCount / 6;
  for (let i = 0; i < tailCount; i++) {
    tailPositions[i * 3] = (i % tailSegments) / tailSegments;
    tailPositions[i * 3 + 1] = Math.floor(i / tailSegments);
  }
  const tailGeometry = new THREE.BufferGeometry();
  tailGeometry.setAttribute("position", new THREE.BufferAttribute(tailPositions, 3));
  const tailMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uRatio: uniforms.uRatio, uExplosion: uniforms.uExplosion },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `uniform float uTime; uniform float uRatio; uniform float uExplosion;
      varying vec3 vColor; varying float vLight;
      void main() {
        float trail = position.x;
        float orbit = position.y;
        float angle = uTime * (0.18 + orbit * 0.025) + orbit * 1.047 - trail * 0.28;
        float radius = 3.6 + orbit * 0.29 + uExplosion * 0.2;
        vec3 p = vec3(cos(angle) * radius, sin(angle * 1.5 + orbit) * 0.65, sin(angle) * radius);
        vec4 view = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * view;
        gl_PointSize = (1.5 + 4.0 * pow(1.0-trail, 3.0)) * uRatio * 14.0 / max(3.0, -view.z);
        vColor = mix(vec3(0.25, 0.76, 1.0), vec3(1.0, 0.85, 0.56), mod(orbit, 2.0));
        vLight = pow(1.0-trail, 2.0) * 1.5;
      }`, fragmentShader,
  });
  const tails = new THREE.Points(tailGeometry, tailMaterial);
  tails.frustumCulled = false;
  group.add(tails);

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
  let focused = false;
  let focusBlend = 0;
  let formation = 0;
  let easedFormation = 0;
  let dispersion = 0;
  let easedDispersion = 0;
  let ratio = Math.min(devicePixelRatio || 1, lowPower ? 1.5 : 2);
  const pointer = new THREE.Vector2(0, 0);
  const easedPointer = new THREE.Vector2(0, 0);
  const trailingPointer = new THREE.Vector2(0, 0);

  function measure() {
    const hero = main.querySelector<HTMLElement>(".home-hero");
    const start = main.getBoundingClientRect().top + scrollY;
    if (hero) {
      // Real document sections drive the journey, not virtual hero chapters.
      stops = [start];
      main.querySelectorAll<HTMLElement>("[data-galaxy-stop]").forEach((section) => {
        stops.push(section.getBoundingClientRect().top + scrollY - innerHeight * 0.25);
      });
    } else {
      stops = [start];
      main.querySelectorAll<HTMLElement>(":scope > section:not(.page-hero), :scope > article, .case-study").forEach((section) => {
        const stop = section.getBoundingClientRect().top + scrollY - innerHeight * 0.2;
        if (stop > start + 60) stops.push(stop);
      });
      stops.push(Math.max(start + 100, start + main.offsetHeight - innerHeight * 0.65));
      stops = [...new Set(stops)].sort((a, b) => a - b);
    }
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
    if (slowFrames > 150 && ratio > 1.5) {
      ratio = 1.5;
      renderer.setPixelRatio(ratio);
      renderer.setSize(innerWidth, innerHeight, false);
      uniforms.uRatio.value = ratio;
      slowFrames = 0;
    }
    lastRender = time;
    elapsed += dt;
    const easing = still ? 1 : 1 - Math.exp(-dt * 5);
    focusBlend += ((focused ? 1 : 0) - focusBlend) * easing;
    easedFormation += (formation - easedFormation) * easing;
    easedDispersion += (dispersion - easedDispersion) * easing;
    journey += (targetJourney - journey) * easing;
    easedPointer.lerp(pointer, easing);
    trailingPointer.lerp(easedPointer, still ? 1 : 1 - Math.exp(-dt * 2.2));
    const index = Math.min(views.length - 2, Math.floor(journey));
    const mix = THREE.MathUtils.smoothstep(journey - index, 0, 1);
    const from = views[index];
    const to = views[index + 1];
    const lerp = THREE.MathUtils.lerp;
    group.position.set(lerp(from.x, to.x, mix) * (compact.matches ? 0.28 : camera.aspect / 1.85), compact.matches ? 2 : lerp(from.y, to.y, mix), 0);
    group.rotation.set(lerp(from.tilt, to.tilt, mix) + easedPointer.y * 0.12, elapsed * 0.04 + easedPointer.x * 0.12, lerp(from.roll, to.roll, mix));
    group.scale.setScalar(lerp(from.scale, to.scale, mix) * (compact.matches ? 0.63 : 1));
    uniforms.uExplosion.value = lerp(from.explosion, to.explosion, mix) + Math.sin(mix * Math.PI) * (from.shape !== to.shape ? 1.25 : 0.3);
    uniforms.uShape.value = lerp(from.shape, to.shape, mix);
    // The observatory reuses this scene, easing away from and back into the story.
    group.position.multiplyScalar(1 - focusBlend);
    group.position.y += focusBlend * (compact.matches ? 1.6 : 0.6);
    group.rotation.x = lerp(group.rotation.x, .82 + easedPointer.y * .28, focusBlend);
    group.rotation.z = lerp(group.rotation.z, -.3, focusBlend);
    group.rotation.y += easedPointer.x * .28 * focusBlend;
    group.scale.setScalar(lerp(group.scale.x, compact.matches ? .58 : .95, focusBlend));
    uniforms.uShape.value = lerp(uniforms.uShape.value, easedFormation, focusBlend);
    uniforms.uExplosion.value = lerp(uniforms.uExplosion.value, easedDispersion, focusBlend);
    uniforms.uTime.value = elapsed;
    uniforms.uPointer.value.copy(easedPointer);
    uniforms.uPointerStrength.value = lerp(uniforms.uPointerStrength.value, pointerActive ? 1 : 0, easing);
    uniforms.uWake.value.copy(easedPointer).sub(trailingPointer).clampLength(0, 0.35);
    field.rotation.y = easedPointer.x * 0.018 + journey * 0.025 + elapsed * 0.002;
    field.rotation.x = easedPointer.y * 0.012;
    renderer.render(scene, camera);
    canvas.dataset.ready = "true";
    // Exposed on the canvas for QA without retaining scene references globally.
    canvas.dataset.drawCalls = String(renderer.info.render.calls);
    canvas.dataset.particles = String(count + fieldCount + tailCount);
    canvas.dataset.shape = uniforms.uShape.value.toFixed(2);
    canvas.dataset.explosion = uniforms.uExplosion.value.toFixed(2);
    canvas.dataset.focus = focusBlend.toFixed(2);
  }
  function updateLoop() {
    renderer.setAnimationLoop(null);
    previousTime = 0;
    if (!paused && !document.hidden && (inView || focused) && !lost && !disposed) renderer.setAnimationLoop((time) => render(time));
    canvas.dataset.motion = paused ? "paused" : "running";
  }
  function move(event: PointerEvent) {
    if (paused || event.pointerType === "touch") return;
    pointer.set(event.clientX / innerWidth * 2 - 1, 1 - event.clientY / innerHeight * 2);
    pointerActive = true;
  }
  function leave() { pointerActive = false; pointer.set(0, 0); }
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
    setFocus(value: boolean) {
      focused = value;
      leave();
      if (paused) render(0, true);
      updateLoop();
    },
    setFormation(shape: number, spread: number) {
      formation = THREE.MathUtils.clamp(shape, 0, 3);
      dispersion = THREE.MathUtils.clamp(spread, 0, 1.5);
      if (paused) render(0, true);
    },
    setPage(page: HTMLElement) {
      observer.unobserve(main);
      resizeObserver.unobserve(main);
      main = page;
      observer.observe(main);
      resizeObserver.observe(main);
      measure();
      if (paused) { journey = targetJourney; render(0, true); }
    },
    dispose() {
      disposed = true;
      renderer.setAnimationLoop(null);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", updateLoop);
      reduced.removeEventListener("change", motionChanged);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      geometry.dispose(); material.dispose(); fieldGeometry.dispose(); fieldMaterial.dispose();
      tailGeometry.dispose(); tailMaterial.dispose();
      renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
