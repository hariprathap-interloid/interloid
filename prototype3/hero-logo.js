/* ==========================================================================
   Hero — particles scatter, then resolve into the Interloid mark. Auto loop.

   Where the shape comes from:
   `.claude/skills/interloid-logo.svg` turned out to be a 1024x1024 PNG
   base64'd inside an SVG wrapper — no paths to trace. So the mark was sampled
   offline to `logo-points.json` (5,000 points, 63 KB) instead of shipping the
   568 KB asset and rasterising it in the browser on every load.

   The sampler kept only pixels that are NOT white, which is what preserves the
   white counters inside the monogram — without that the cloud resolves into a
   filled blob rather than the logo.

   Colour is derived from each point's x position (brand -> accent, left to
   right), mirroring the mark's own gradient, so no per-point RGB is stored.
   ========================================================================== */
import * as THREE from 'three';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* sRGB equivalents of theme.css --brand / --accent / --brand-light. */
const C = {
  brand:  new THREE.Color('#1f5da0'),
  accent: new THREE.Color('#289dbe'),
  light:  new THREE.Color('#3a7bc8'),
};

const hero   = $('#hero');
const stage  = $('.stage');
const canvas = $('canvas', stage);
const stateL = $('#state');

let isLight = false;

/* --------------------------------------------------------------------------
   Theme switch. The particles must dim on light — dark points on a pale
   ground compete with dark body text, which is the readability problem.
   -------------------------------------------------------------------------- */
let applyTheme = () => {};
function setTheme(t) {
  isLight = t === 'light';
  document.documentElement.classList.toggle('light', isLight);
  $$('.th').forEach(b => {
    const on = b.dataset.theme === t;
    b.classList.toggle('bg-accent', on);
    b.classList.toggle('text-white', on);
    b.classList.toggle('text-ink-foreground', !on);
  });
  applyTheme();
}
$$('.th').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.theme)));

function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

async function boot() {
  let data;
  try {
    data = await (await fetch('logo-points.json')).json();
  } catch (e) {
    console.error('logo points unavailable; CSS fallback stands', e);
    return;
  }

  const N = data.count;
  const src = data.pos;                       /* flat [x,y,x,y,...] in -1..1 */

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 15;

  const chaos = new Float32Array(N * 3);
  const order = new Float32Array(N * 3);
  const pos   = new Float32Array(N * 3);
  const col   = new Float32Array(N * 3);

  /* Mark sits right of centre so it never sits under the copy. */
  /* Smaller mark = same 5,000 points over less area = a denser, more
     legible silhouette. It was also clipping the right edge at 5.4. */
  const SCALE = 4.0, OFFSET_X = 4.6;
  const tmp = new THREE.Color();

  for (let i = 0; i < N; i++) {
    const x = src[i * 2], y = src[i * 2 + 1];

    order[i*3]     = x * SCALE + OFFSET_X;
    order[i*3 + 1] = y * SCALE;
    order[i*3 + 2] = (Math.random() - 0.5) * 0.5;   /* a little depth, still flat */

    /* Scatter: a shell around where the mark will be, so the collapse reads
       as convergence rather than as the cloud flying in from off-screen. */
    const r = 7 + Math.random() * 7, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    chaos[i*3]     = r * Math.sin(ph) * Math.cos(th) + OFFSET_X;
    chaos[i*3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.66;
    chaos[i*3 + 2] = r * Math.cos(ph) * 0.5;

    /* brand -> accent across the mark, as the logo itself runs */
    tmp.copy(C.brand).lerp(C.accent, clamp((x + 1) / 2));
    if (Math.random() < 0.18) tmp.lerp(C.light, 0.5);
    col[i*3] = tmp.r; col[i*3+1] = tmp.g; col[i*3+2] = tmp.b;
  }
  pos.set(chaos);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.08, vertexColors: true, transparent: true,
    depthWrite: false, sizeAttenuation: true,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);
  const attr = geo.getAttribute('position');

  /* Additive is right on dark (points glow, background is black so nothing
     blows out) and wrong on light (it only brightens — particles disappear). */
  applyTheme = () => {
    /* The copy is protected by the scrim and by placement, not by making the
       mark faint — a washed-out logo just looks broken. */
    mat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
    mat.opacity  = isLight ? 0.9 : 0.95;
    mat.size     = isLight ? 0.085 : 0.08;
    mat.needsUpdate = true;
  };
  applyTheme();

  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    ptr.tx = (e.clientX - r.left) / r.width * 2 - 1;
    ptr.ty = -((e.clientY - r.top) / r.height * 2 - 1);
  });
  hero.addEventListener('pointerleave', () => { ptr.tx = 0; ptr.ty = 0; });

  const resize = () => {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    /* On narrow screens the mark centres instead of sitting right, or it
       would be cropped off the side entirely. */
    points.position.x = w < 900 ? -OFFSET_X : 0;
    points.position.y = w < 900 ? 2.2 : 0;
  };
  resize();
  addEventListener('resize', resize);

  const ease = (t) => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
  const CYCLE = 13;                                  /* seconds */

  let raf = null, t0 = performance.now(), shown = 0;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;

    /* scatter (0-38%) -> hold resolved (38-78%) -> disperse (78-100%) */
    const c = (t % CYCLE) / CYCLE;
    const target = c < .38 ? c / .38 : c < .78 ? 1 : 1 - (c - .78) / .22;
    shown += (target - shown) * 0.08;
    const k = ease(clamp(shown));

    stateL.textContent = shown < .1 ? 'Scattered' : shown < .7 ? 'Converging' : 'Resolved';

    ptr.x += (ptr.tx - ptr.x) * .05;
    ptr.y += (ptr.ty - ptr.y) * .05;

    for (let n = 0; n < N; n++) {
      const j = n * 3;
      /* drift dies away as the mark forms — a logo should settle, not wobble */
      const b = 1 + Math.sin(t * .7 + n * .013) * .09 * (1 - k);
      pos[j]   = (chaos[j]   + (order[j]   - chaos[j])   * k) * b;
      pos[j+1] = (chaos[j+1] + (order[j+1] - chaos[j+1]) * k) * b;
      pos[j+2] =  chaos[j+2] + (order[j+2] - chaos[j+2]) * k;
    }
    attr.needsUpdate = true;

    /* Rotation must stop as it resolves, or the mark is never legible. */
    points.rotation.y = (t * .05 + ptr.x * .3) * (1 - k) + ptr.x * .06 * k;
    points.rotation.x = ptr.y * .16 * (1 - k * .8);

    renderer.render(scene, camera);
  }

  const first = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(() => stage.classList.add('ready'));
  };
  first();

  if (REDUCED) {                                     /* resolved and still */
    for (let n = 0; n < N * 3; n++) pos[n] = order[n];
    attr.needsUpdate = true;
    stateL.textContent = 'Resolved';
    renderer.render(scene, camera);
    return;
  }

  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && raf === null) { t0 = performance.now(); raf = requestAnimationFrame(frame); }
    else if (!e.isIntersecting && raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 }).observe(hero);
}

setTheme('dark');
if (webglOK()) {
  if ('requestIdleCallback' in window) requestIdleCallback(boot, { timeout: 1200 });
  else setTimeout(boot, 200);
}
