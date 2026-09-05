/* ==========================================================================
   Hero — the mark condenses out of smoke, and glows under the cursor.

   Where the shape comes from
   --------------------------
   `.claude/skills/interloid-logo.svg` is a 1024x1024 PNG base64'd inside an
   SVG wrapper — no paths to trace. The mark was sampled offline on a jittered
   grid into `logo-points.json` (3,810 points, 48 KB) rather than shipping the
   568 KB asset and rasterising it on every load. The sampler keeps only
   non-white pixels, which is what preserves the counters in the monogram.

   Three things this build fixes
   -----------------------------
   1. NO CARD FLIP. The old version scattered points onto a fixed sphere and
      span the whole cloud. Because that shell was flattened, the spin read as
      a card turning over. Points now disperse OUTWARD FROM THEIR OWN PLACE in
      the mark, and nothing rotates. The mark comes apart in situ.

   2. SMOKE, NOT A BLOB. Dispersal is radial-plus-random with an upward bias,
      and every point drifts on its own sine phase, so the cloud curls instead
      of sitting in a sphere.

   3. A SOFTER GLOW. The old one drove colour to white, which read as harsh.
      It now warms toward an airy brand blue over a wider radius with a
      smootherstep falloff, and a swollen dot fades at its edges so the effect
      is haze rather than a hard disc getting bigger.

   Interaction is glow-only: nothing is displaced, so the cursor can never
   damage the mark.
   ========================================================================== */
import * as THREE from 'three';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* sRGB equivalents of theme.css --brand / --accent, plus the glow target. */
const C = {
  brand:  new THREE.Color('#1f5da0'),
  accent: new THREE.Color('#289dbe'),
  halo:   new THREE.Color('#7fc4de'),   /* airy, still unmistakably brand */
};

const hero   = $('#hero');
const stage  = $('.stage');
const canvas = $('canvas', stage);
const stateL = $('#state');

let isLight = false;
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
  try { data = await (await fetch('logo-points.json')).json(); }
  catch (e) { console.error('logo points unavailable; CSS fallback stands', e); return; }

  const N = data.count, src = data.pos;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  const DPR = Math.min(devicePixelRatio, 2);
  renderer.setPixelRatio(DPR);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 15;

  const unit  = new Float32Array(N * 2);   /* logo position, unit space    */
  const smoke = new Float32Array(N * 3);   /* dispersal vector, unit space */
  const phase = new Float32Array(N * 2);   /* turbulence phase + speed     */
  const pos   = new Float32Array(N * 3);
  const col   = new Float32Array(N * 3);
  const rest  = new Float32Array(N * 3);   /* colour at rest, for the glow mix */
  const size  = new Float32Array(N);

  let SCALE = 4, OFFSET_X = 4.6;
  const FRAME = { w: 14, h: 14 };
  const tmp = new THREE.Color();

  for (let i = 0; i < N; i++) {
    const x = src[i*2], y = src[i*2+1];
    unit[i*2] = x; unit[i*2+1] = y;

    /* Disperse outward from where the point already sits, not from a shared
       centre — that is what makes it read as the mark coming apart rather
       than as a cloud flying in from elsewhere. */
    const len = Math.hypot(x, y) || 1e-4;
    const a = (Math.random() - .5) * 1.9;            /* wander off pure radial */
    const dx = x / len, dy = y / len;
    const reach = .55 + Math.random() * 1.5;

    smoke[i*3]   = (dx * Math.cos(a) - dy * Math.sin(a)) * reach;
    smoke[i*3+1] = (dx * Math.sin(a) + dy * Math.cos(a)) * reach + .45 + Math.random() * .5;
    smoke[i*3+2] = (Math.random() - .5) * .8;

    phase[i*2]   = Math.random() * Math.PI * 2;
    phase[i*2+1] = .5 + Math.random() * .9;

    tmp.copy(C.brand).lerp(C.accent, clamp((x + 1) / 2));
    col[i*3] = rest[i*3] = tmp.r;
    col[i*3+1] = rest[i*3+1] = tmp.g;
    col[i*3+2] = rest[i*3+2] = tmp.b;
    size[i] = 1;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  geo.setAttribute('aSize',    new THREE.BufferAttribute(size, 1));

  /* ShaderMaterial rather than PointsMaterial: PointsMaterial draws SQUARES,
     which was most of why earlier builds read as noise. It also gives the
     per-point size attribute the glow needs. gl_PointSize is device pixels. */
  const uni = { uSize: { value: 1.9 }, uOpacity: { value: .95 }, uDpr: { value: DPR } };
  const mat = new THREE.ShaderMaterial({
    uniforms: uni, transparent: true, depthWrite: false, vertexColors: true,
    vertexShader: `
      attribute float aSize;
      varying vec3 vColor;
      varying float vSwell;
      uniform float uSize, uDpr;
      void main() {
        vColor = color;
        vSwell = aSize;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uSize * uDpr * (60.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying vec3 vColor;
      varying float vSwell;
      uniform float uOpacity;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        /* The more a dot has swollen, the softer and fainter it gets, so the
           glow reads as smoke rather than as a hard disc growing. */
        float s = clamp(vSwell - 1.0, 0.0, 1.0);
        float inner = mix(0.32, 0.0, s);
        float a = smoothstep(0.5, inner, d);
        if (a < 0.01) discard;
        gl_FragColor = vec4(vColor, a * uOpacity * mix(1.0, 0.42, s));
      }`,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);
  const aPos = geo.getAttribute('position');
  const aCol = geo.getAttribute('color');
  const aSz  = geo.getAttribute('aSize');

  applyTheme = () => {
    mat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
    uni.uOpacity.value = isLight ? 1 : .95;
    uni.uSize.value    = isLight ? 2.2 : 1.9;
  };
  applyTheme();

  const ptr = { x: 0, y: 0, tx: 0, ty: 0, inside: false };
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    ptr.tx = (e.clientX - r.left) / r.width * 2 - 1;
    ptr.ty = -((e.clientY - r.top) / r.height * 2 - 1);
    ptr.inside = true;
  });
  hero.addEventListener('pointerleave', () => { ptr.inside = false; });

  const resize = () => {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    FRAME.h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    FRAME.w = FRAME.h * camera.aspect;
    const narrow = w < 900;
    /* A fixed fraction of the viewport, so the mark is the same size on a
       1280 laptop and a 2560 monitor. */
    SCALE = FRAME.h * (narrow ? .30 : .34);
    OFFSET_X = narrow ? 0 : Math.min(FRAME.w * .26, FRAME.w / 2 - SCALE * 1.05);
    points.position.y = narrow ? FRAME.h * .20 : 0;
  };
  resize();
  addEventListener('resize', resize);

  const ease = (t) => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
  const CYCLE = 14;
  const R = 3.4;                       /* glow radius, world units */
  let raf = null, t0 = performance.now(), shown = 0;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;

    /* condense (0-40%) -> hold the mark (40-80%) -> disperse (80-100%) */
    const c = (t % CYCLE) / CYCLE;
    const target = c < .40 ? c / .40 : c < .80 ? 1 : 1 - (c - .80) / .20;
    shown += (target - shown) * .075;
    const k = ease(clamp(shown));
    const away = 1 - k;

    stateL.textContent = shown < .12 ? 'Dispersed' : shown < .75 ? 'Condensing' : 'Resolved';

    ptr.x += (ptr.tx - ptr.x) * .12;
    ptr.y += (ptr.ty - ptr.y) * .12;
    const cx = ptr.x * FRAME.w / 2, cy = ptr.y * FRAME.h / 2;
    const active = ptr.inside && !REDUCED;

    for (let n = 0; n < N; n++) {
      const j = n * 3, u = n * 2;

      const hx = unit[u] * SCALE + OFFSET_X;
      const hy = unit[u+1] * SCALE;

      /* All turbulence lives in the dispersal term, so a resolved mark is
         perfectly still and a dispersed one curls. */
      const ph = phase[u], sp = phase[u+1];
      const tx = Math.sin(t * sp + ph) * .30;
      const ty = Math.cos(t * sp * .8 + ph * 1.7) * .26;
      const rise = Math.sin(t * .22 + ph) * .18;

      const x = hx + (smoke[j]   + tx)         * SCALE * away;
      const y = hy + (smoke[j+1] + ty + rise)  * SCALE * away;
      const z =       smoke[j+2]               * SCALE * away;

      pos[j] = x; pos[j+1] = y; pos[j+2] = z;

      /* ---- glow: brightness and size only, never position ---- */
      let g = 0;
      if (active) {
        const dx = x - cx, dy = y - cy;
        const d2 = dx*dx + dy*dy;
        if (d2 < R * R) {
          const f = 1 - Math.sqrt(d2) / R;
          g = f*f*f * (f * (f * 6 - 15) + 10) * 0.5;      /* smootherstep */
        }
      }

      size[n] = 1 + g * 1.9;
      if (g > .002) {
        col[j]   = rest[j]   + (C.halo.r - rest[j])   * g;
        col[j+1] = rest[j+1] + (C.halo.g - rest[j+1]) * g;
        col[j+2] = rest[j+2] + (C.halo.b - rest[j+2]) * g;
      } else {
        col[j] = rest[j]; col[j+1] = rest[j+1]; col[j+2] = rest[j+2];
      }
    }

    aPos.needsUpdate = true;
    aCol.needsUpdate = true;
    aSz.needsUpdate  = true;

    /* A whisper of parallax. Nothing rotates — rotation is what made the
       dispersed cloud look like a card being flipped. */
    points.position.x = ptr.x * .18;
    renderer.render(scene, camera);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(() => stage.classList.add('ready'));

  if (REDUCED) {
    for (let n = 0; n < N; n++) {
      pos[n*3]   = unit[n*2] * SCALE + OFFSET_X;
      pos[n*3+1] = unit[n*2+1] * SCALE;
      pos[n*3+2] = 0;
    }
    aPos.needsUpdate = true;
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
