/* ==========================================================================
   Order from chaos — light theme, visitor-driven.

   Two changes from the dark version:

   1. LIGHT GROUND. Additive blending is useless on a light background — it
      only ever brightens, so particles vanish into the page. This uses normal
      blending with per-particle colour instead, and leans on size attenuation
      for depth so the cloud reads as a volume rather than a flat spray.

   2. THE VISITOR DRIVES IT. `scroll` mode turns the hero into a 220vh track
      with a sticky viewport, so scroll position IS the timeline — the
      particles resolve because the reader is moving, not because a timer
      fired. `cursor` and `auto` are here to compare against.
   ========================================================================== */
import * as THREE from 'three';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* sRGB equivalents of theme.css --brand / --accent / --brand-light. */
const C = {
  brand:  new THREE.Color('#1f5da0'),
  accent: new THREE.Color('#289dbe'),
  light:  new THREE.Color('#3a7bc8'),
};

const track  = $('#track');
const stage  = $('.stage');
const canvas = $('canvas', stage);
const meter  = $('#meter');
const pct    = $('#pct');
const hint   = $('#hint');
const stateL = $('#stateLabel');

let mode = 'scroll';
let progress = 0;      /* 0 = scattered, 1 = resolved */
let shown = 0;         /* eased follower, so nothing ever snaps */

/* --------------------------------------------------------------------------
   Read-out
   -------------------------------------------------------------------------- */
const HINTS = { scroll: 'Scroll to resolve', pointer: 'Move cursor right to resolve', auto: 'Resolving on a loop' };
function paintReadout(p) {
  meter.style.setProperty('--p', p.toFixed(3));
  pct.textContent = Math.round(p * 100) + '%';
  stateL.textContent = p < 0.08 ? 'Scattered' : p < 0.55 ? 'Converging' : p < 0.94 ? 'Almost there' : 'Shipped';
}

/* --------------------------------------------------------------------------
   Scene
   -------------------------------------------------------------------------- */
function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

function boot() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
  camera.position.z = 15;

  const N = 4200;
  const chaos = new Float32Array(N * 3);
  const order = new Float32Array(N * 3);
  const pos   = new Float32Array(N * 3);
  const col   = new Float32Array(N * 3);

  /* Lattice — wide, shallow, offset right so it sits clear of the copy. */
  const gx = 30, gy = 12, gz = 11, sp = 0.6, OFFSET_X = 4.2;
  let i = 0;
  for (let x = 0; x < gx && i < N; x++)
    for (let y = 0; y < gy && i < N; y++)
      for (let z = 0; z < gz && i < N; z++, i++) {
        order[i*3]   = (x - gx/2) * sp + OFFSET_X;
        order[i*3+1] = (y - gy/2) * sp;
        order[i*3+2] = (z - gz/2) * sp;
      }
  for (; i < N; i++) {
    order[i*3]   = (Math.random()-.5) * gx * sp + OFFSET_X;
    order[i*3+1] = (Math.random()-.5) * gy * sp;
    order[i*3+2] = (Math.random()-.5) * gz * sp;
  }

  const tmp = new THREE.Color();
  for (let k = 0; k < N; k++) {
    const r = 8 + Math.random() * 8, th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1);
    chaos[k*3]   = r * Math.sin(ph) * Math.cos(th) + OFFSET_X;
    chaos[k*3+1] = r * Math.sin(ph) * Math.sin(th) * .62;
    chaos[k*3+2] = r * Math.cos(ph);
    /* Bias toward brand so the cloud stays legible on a pale ground; the
       accent shows up as highlights rather than half the cloud. */
    tmp.copy(C.brand).lerp(Math.random() < .3 ? C.accent : C.light, Math.random() * .85);
    col[k*3] = tmp.r; col[k*3+1] = tmp.g; col[k*3+2] = tmp.b;
  }
  pos.set(chaos);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({
    /* sizeAttenuation carries the depth read on its own; a custom depth-fade
       shader here is fragile (PointsMaterial's fragment stage has no
       vViewPosition varying to hook, so patching it fails to compile). */
    size: .085, vertexColors: true, transparent: true, opacity: .78,
    blending: THREE.NormalBlending, depthWrite: false, sizeAttenuation: true,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);
  const attr = geo.getAttribute('position');

  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  track.addEventListener('pointermove', (e) => {
    const r = track.getBoundingClientRect();
    ptr.tx = (e.clientX - r.left) / r.width * 2 - 1;
    ptr.ty = -((e.clientY - r.top) / r.height * 2 - 1);
    if (mode === 'pointer') progress = clamp((ptr.tx + 1) / 2);
  });
  track.addEventListener('pointerleave', () => { ptr.tx = 0; ptr.ty = 0; });

  const resize = () => {
    const w = track.clientWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  addEventListener('resize', resize);

  const ease = (t) => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;

  function readScroll() {
    const r = track.getBoundingClientRect();
    const travel = track.offsetHeight - window.innerHeight;
    if (travel <= 0) return 1;
    return clamp(-r.top / travel);
  }

  let raf = null, t0 = performance.now();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;

    if (mode === 'scroll') progress = readScroll();
    if (mode === 'auto') {
      const cyc = (t % 12) / 12;
      progress = cyc < .5 ? cyc / .5 : cyc < .78 ? 1 : 1 - (cyc - .78) / .22;
    }

    shown += (progress - shown) * 0.09;
    const k = ease(clamp(shown));
    paintReadout(shown);

    ptr.x += (ptr.tx - ptr.x) * .05;
    ptr.y += (ptr.ty - ptr.y) * .05;

    for (let n = 0; n < N; n++) {
      const j = n * 3;
      /* Breathing decays as the lattice resolves — order should feel settled. */
      const b = 1 + Math.sin(t * .65 + n * .017) * .1 * (1 - k);
      pos[j]   = (chaos[j]   + (order[j]   - chaos[j])   * k) * b;
      pos[j+1] = (chaos[j+1] + (order[j+1] - chaos[j+1]) * k) * b;
      pos[j+2] =  chaos[j+2] + (order[j+2] - chaos[j+2]) * k;
    }
    attr.needsUpdate = true;

    points.rotation.y = t * .04 * (1 - k * .7) + ptr.x * .3;
    points.rotation.x = ptr.y * .18;

    renderer.render(scene, camera);
  }

  /* Paint one frame immediately so the fade-in has something to reveal. */
  const first = () => {
    for (let n = 0; n < N * 3; n++) pos[n] = chaos[n];
    attr.needsUpdate = true;
    renderer.render(scene, camera);
    requestAnimationFrame(() => stage.classList.add('ready'));
  };
  first();

  if (REDUCED) {                       /* resolved, still, honest */
    progress = shown = 1;
    for (let n = 0; n < N * 3; n++) pos[n] = order[n];
    attr.needsUpdate = true;
    paintReadout(1);
    renderer.render(scene, camera);
    return;
  }

  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && raf === null) { t0 = performance.now(); raf = requestAnimationFrame(frame); }
    else if (!e.isIntersecting && raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 }).observe(track);
}

/* --------------------------------------------------------------------------
   Mode switch (lab only)
   -------------------------------------------------------------------------- */
function setMode(m) {
  mode = m;
  track.dataset.mode = m;
  hint.textContent = HINTS[m];
  if (m !== 'scroll') progress = m === 'pointer' ? clamp((ptrX + 1) / 2) : progress;
  $$('.md').forEach(b => {
    const on = b.dataset.mode === m;
    b.classList.toggle('bg-primary', on);
    b.classList.toggle('text-primary-foreground', on);
    b.classList.toggle('text-muted-foreground', !on);
  });
  if (m === 'scroll') window.scrollTo({ top: 0, behavior: 'auto' });
}
let ptrX = 0;
$$('.md').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
setMode('scroll');

if (webglOK()) {
  if ('requestIdleCallback' in window) requestIdleCallback(boot, { timeout: 1200 });
  else setTimeout(boot, 200);
} else {
  paintReadout(1);
  hint.textContent = 'WebGL unavailable — static fallback';
}
