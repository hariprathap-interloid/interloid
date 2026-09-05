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

  const unit  = new Float32Array(N * 2);
  const chaos = new Float32Array(N * 3);
  const pos   = new Float32Array(N * 3);
  const col   = new Float32Array(N * 3);

  /* Scale and placement are derived from the camera frustum at resize, not
     hard-coded. A fixed world size looks correct at one window and oversized
     or clipped at every other — which is exactly what happened at 2000px. */
  let SCALE = 4.0, OFFSET_X = 4.6;
  const FRAME = { h: 14, w: 14 };
  const tmp = new THREE.Color();

  for (let i = 0; i < N; i++) {
    const x = src[i * 2], y = src[i * 2 + 1];

    /* stored at unit scale; SCALE/OFFSET_X are applied every frame so a
       resize re-lays the mark instead of needing the buffers rebuilt */
    unit[i*2]     = x;
    unit[i*2 + 1] = y;

    /* Scatter: a shell around where the mark will be, so the collapse reads
       as convergence rather than as the cloud flying in from off-screen. */
    const r = 1.5 + Math.random() * 1.6, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    chaos[i*3]     = r * Math.sin(ph) * Math.cos(th);
    chaos[i*3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.66;
    chaos[i*3 + 2] = r * Math.cos(ph) * 0.35;

    /* brand -> accent across the mark, as the logo itself runs */
    tmp.copy(C.brand).lerp(C.accent, clamp((x + 1) / 2));
    if (Math.random() < 0.16) tmp.lerp(C.light, 0.45);
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
    mat.opacity  = isLight ? 1 : 0.95;
    mat.size     = isLight ? 0.115 : 0.10;
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

    /* visible world size at the mark's depth */
    FRAME.h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    FRAME.w = FRAME.h * camera.aspect;

    const narrow = w < 900;
    /* Mark occupies a fixed FRACTION of the viewport, so it looks the same
       size on a 1280 laptop and a 2560 monitor. */
    SCALE = FRAME.h * (narrow ? 0.30 : 0.34);
    /* Sit it in the right-hand third; clamp so it can never leave the frame. */
    OFFSET_X = narrow ? 0 : Math.min(FRAME.w * 0.26, FRAME.w / 2 - SCALE * 1.05);
    points.position.y = narrow ? FRAME.h * 0.20 : 0;
  };
  resize();
  addEventListener('resize', resize);

  const ease = (t) => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
  const CYCLE = 13;                                  /* seconds */

  let raf = null, t0 = performance.now(), shown = 0;

  /* Cursor in world units on the mark's plane, so repulsion is in the same
     space as the points rather than in screen pixels. */
  const cur = new THREE.Vector2(0, 0);
  const R = 2.6;                 /* influence radius, world units */

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;

    /* scatter (0-38%) -> hold resolved (38-78%) -> disperse (78-100%) */
    const c = (t % CYCLE) / CYCLE;
    const target = c < .38 ? c / .38 : c < .78 ? 1 : 1 - (c - .78) / .22;
    shown += (target - shown) * 0.08;
    const k = ease(clamp(shown));

    stateL.textContent = shown < .1 ? 'Scattered' : shown < .7 ? 'Converging' : 'Resolved';

    ptr.x += (ptr.tx - ptr.x) * .08;
    ptr.y += (ptr.ty - ptr.y) * .08;
    cur.set(ptr.x * FRAME.w / 2, ptr.y * FRAME.h / 2);

    const rot = (t * .05) * (1 - k);          /* spin only while unresolved */
    const cosR = Math.cos(rot), sinR = Math.sin(rot);

    for (let n = 0; n < N; n++) {
      const j = n * 3, u = n * 2;

      /* Target lattice, laid out at the CURRENT responsive scale. */
      const ox = unit[u] * SCALE + OFFSET_X;
      const oy = unit[u + 1] * SCALE;

      /* Scatter shell, also scaled to the frame. */
      const cx = chaos[j]     * SCALE + OFFSET_X;
      const cy = chaos[j + 1] * SCALE;
      const cz = chaos[j + 2] * SCALE;

      const b = 1 + Math.sin(t * .7 + n * .013) * .09 * (1 - k);
      let x = (cx + (ox - cx) * k) * b;
      let y = (cy + (oy - cy) * k) * b;
      let z =  cz + (0 - cz) * k;

      /* Spin the unresolved cloud around its own centre. */
      if (rot !== 0) {
        const dx = x - OFFSET_X;
        x = OFFSET_X + dx * cosR - z * sinR;
        z = dx * sinR + z * cosR;
      }

      /* --- Cursor interaction ------------------------------------------
         Points inside R are pushed away along the cursor vector, with a
         smooth falloff so the edge of the effect is invisible. This is what
         makes the mark feel touchable rather than played back. */
      const dx = x - cur.x, dy = y - cur.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < R * R) {
        const d = Math.sqrt(d2) || 0.0001;
        const f = (1 - d / R);
        const push = f * f * 2.4;             /* quadratic falloff */
        x += (dx / d) * push;
        y += (dy / d) * push;
        z += f * f * 1.4;                     /* lift toward the viewer */
      }

      pos[j] = x; pos[j + 1] = y; pos[j + 2] = z;
    }
    attr.needsUpdate = true;

    /* A small parallax tilt only — the mark must stay square-on to be read. */
    points.rotation.y = ptr.x * .05 * (1 - k * .6);
    points.rotation.x = ptr.y * .05 * (1 - k * .6);

    renderer.render(scene, camera);
  }

  const first = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(() => stage.classList.add('ready'));
  };
  first();

  if (REDUCED) {                                     /* resolved and still */
    for (let n = 0; n < N; n++) {
      pos[n*3] = unit[n*2] * SCALE + OFFSET_X;
      pos[n*3+1] = unit[n*2+1] * SCALE;
      pos[n*3+2] = 0;
    }
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
