/* ==========================================================================
   Hero — the mark disperses into smoke and re-forms. Auto loop.

   Where the shape comes from
   --------------------------
   `.claude/skills/interloid-logo.svg` is a 1024x1024 PNG base64'd inside an
   SVG wrapper — no paths to trace. The mark was sampled offline on a jittered
   grid into `logo-points.json` (3,810 points, 48 KB) rather than shipping the
   568 KB asset and rasterising it on every load. The sampler keeps only
   non-white pixels, which is what preserves the counters in the monogram.

   What changed in this pass
   -------------------------
   1. GLOW REMOVED. The cursor no longer recolours or swells anything.

   2. NO ROTATION. A 360 orbit was tried and dropped — turning the mark makes
      it unreadable through most of the sweep. The cursor now only shifts the
      cloud a couple of pixels of parallax.

   3. NO HOLE IN THE CENTRE. Dispersal is to a filled shell, not a radial
      push outward from the mark's own centre — that is what used to empty
      the middle.

   4. DISPERSAL MODEL from hero-logo-lab: points gather in from a common
      flattened shell rather than loosening in place.

      NO SPIN. The lab's `rotation.y = t * 0.05 * (1 - k)` is CUMULATIVE in
      elapsed time, so the angle grows without bound — measured at 42 deg by
      14s, 94 deg by 41s, 184 deg by 72s. The cloud is flat (z = 0, shell
      flattened to 0.35), so every time it passes 90 deg it collapses to a
      LINE and reads as a card flipping over. It looks fine for the first
      cycle, which is why it survived earlier review. Do not reintroduce a
      rotation on a flat point cloud.
   ========================================================================== */
import * as THREE from 'three';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, r = document) => r.querySelector(s);

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* sRGB equivalents of theme.css --brand / --accent. */
const C = {
  brand:  new THREE.Color('#1f5da0'),
  accent: new THREE.Color('#289dbe'),
};

/* index.html anchors the section as #home (the nav link); the labs use
   #hero. data-hero is the stable hook. */
const hero   = $('[data-hero]') || $('#hero');
const stage  = $('.stage');
const canvas = $('canvas', stage);
const stateL = $('#state');

/* THEME
   The stage does not own the theme — it observes it. The site convention is
   `.dark` on <html>, light being the default (theme.css). Whoever flips that
   class (script.js on the page, the toggle bar in the labs) is the single
   source of truth; this observer just re-tunes blending, because additive
   blending only brightens and is useless on a pale ground (gotcha 5.17). */
let isLight = !document.documentElement.classList.contains('dark');
let applyTheme = () => {};

new MutationObserver(() => {
  const now = !document.documentElement.classList.contains('dark');
  if (now === isLight) return;
  isLight = now;
  applyTheme();
}).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

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

  const home  = new Float32Array(N * 3);   /* mark position, unit space     */
  const smoke = new Float32Array(N * 3);   /* dispersal offset, unit space  */
  const phase = new Float32Array(N * 2);
  const pos   = new Float32Array(N * 3);
  const col   = new Float32Array(N * 3);

  let SCALE = 4, HOME_X = 4.6, HOME_Y = 0;
  const FRAME = { w: 14, h: 14 };
  const tmp = new THREE.Color();

  for (let i = 0; i < N; i++) {
    const x = src[i*2], y = src[i*2+1];

    home[i*3]     = x;
    home[i*3+1]   = y;
    /* Flat, and nothing rotates it — see the NO SPIN note in the header. */
    home[i*3+2]   = 0;

    /* The lab's dispersal, which reads better than the per-point version:
       every point travels to a common flattened shell around the mark's
       centre, so the cloud gathers INTO the logo rather than the logo merely
       loosening in place. Flattened on y and z (0.66 / 0.35) so it stays a
       drift rather than a ball. */
    const r  = 1.5 + Math.random() * 1.6;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    smoke[i*3]   = r * Math.sin(ph) * Math.cos(th);
    smoke[i*3+1] = r * Math.sin(ph) * Math.sin(th) * .66;
    smoke[i*3+2] = r * Math.cos(ph) * .35;

    phase[i*2]   = Math.random() * Math.PI * 2;
    phase[i*2+1] = .5 + Math.random() * .9;

    tmp.copy(C.brand).lerp(C.accent, clamp((x + 1) / 2));
    col[i*3] = tmp.r; col[i*3+1] = tmp.g; col[i*3+2] = tmp.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  /* ShaderMaterial rather than PointsMaterial: PointsMaterial draws SQUARES,
     which was most of why earlier builds read as noise. gl_PointSize is in
     device pixels. */
  const uni = { uSize: { value: 1.9 }, uOpacity: { value: .95 }, uDpr: { value: DPR } };
  const mat = new THREE.ShaderMaterial({
    uniforms: uni, transparent: true, depthWrite: false, vertexColors: true,
    vertexShader: `
      varying vec3 vColor;
      uniform float uSize, uDpr;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize * uDpr * (60.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying vec3 vColor;
      uniform float uOpacity;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.32, d);
        if (a < 0.01) discard;
        gl_FragColor = vec4(vColor, a * uOpacity);
      }`,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);
  const aPos = geo.getAttribute('position');

  applyTheme = () => {
    mat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
    uni.uOpacity.value = isLight ? 1 : .95;
    uni.uSize.value    = isLight ? 2.2 : 1.9;
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
    FRAME.h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    FRAME.w = FRAME.h * camera.aspect;
    const narrow = w < 900;
    /* A fixed fraction of the viewport, so the mark is the same size on a
       1280 laptop and a 2560 monitor. */
    if (!narrow) {
      SCALE  = FRAME.h * .34;
      HOME_X = Math.min(FRAME.w * .26, FRAME.w / 2 - SCALE * 1.05);
      HOME_Y = 0;
      return;
    }

    /* NARROW — the mark sits in a band across the TOP and the copy stacks
       under it. Two things make this genuinely different from a scaled-down
       desktop layout, and both bit us:

       1. On mobile the SECTION is taller than the viewport (the copy overflows
          it), so `h` here is the section height, not the screen. That makes
          FRAME.w = FRAME.h * w/h very narrow — at 390x844 with a ~1000px tall
          section, FRAME.w is 5.46 against a mark 5.32 wide. Sizing off
          FRAME.h alone put the mark edge to edge and cropped it. Cap it on
          the WIDTH instead; the mark is square in unit space (x +/-1, y
          +/-0.98), so a third of the frame width is a real third.

       2. For the same reason the mark cannot be positioned as a fraction of
          FRAME.h — that lands it relative to the section, not the visible
          band. Read the section's own padding-top (the band the CSS reserves)
          and centre the mark inside it, so the two can never drift apart. */
    /* The band is the section's own padding-top, read from the DOM so the CSS
       reservation and the mark can never drift apart. SCALE is capped against
       it as well as against the frame: when hero copy grows the band shrinks
       to pay for it, and without this cap the mark stays full size and slides
       up behind the nav. Centred at 62% of the band, not 50% — the nav is
       transparent at rest and owns the first ~70px. */
    const band = parseFloat(getComputedStyle(hero).paddingTop) || h * .36;
    const bandWorld = (band / h) * FRAME.h;
    SCALE = Math.min(FRAME.w * .26, FRAME.h * .19, bandWorld * .34);
    HOME_X = 0;
    HOME_Y = ((h / 2 - band * .62) / h) * FRAME.h;
  };
  resize();
  addEventListener('resize', resize);

  const ease = (t) => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
  const CYCLE = 14;
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

    /* Lab-only readout. index.html has no #state, so this must stay guarded. */
    if (stateL) stateL.textContent = shown < .12 ? 'Dispersed' : shown < .75 ? 'Condensing' : 'Resolved';

    ptr.x += (ptr.tx - ptr.x) * .07;
    ptr.y += (ptr.ty - ptr.y) * .07;

    for (let n = 0; n < N; n++) {
      const j = n * 3, u = n * 2;
      const ph = phase[u], sp = phase[u+1];

      /* Turbulence and breathing both fade out with k, so a resolved mark is
         perfectly still. */
      const tx = Math.sin(t * sp + ph) * .26;
      const ty = Math.cos(t * sp * .8 + ph * 1.7) * .22;
      const b  = 1 + Math.sin(t * .7 + n * .013) * .09 * away;

      pos[j]   = ((smoke[j]   + tx) * away + home[j]   * k) * SCALE * b;
      pos[j+1] = ((smoke[j+1] + ty) * away + home[j+1] * k) * SCALE * b;
      pos[j+2] = ( smoke[j+2]       * away + home[j+2] * k) * SCALE;
    }
    aPos.needsUpdate = true;

    /* No rotation. A whisper of parallax only — the mark stays square-on,
       which is the only way it stays legible as a logo. */
    points.position.x = HOME_X + ptr.x * .20;
    points.position.y = HOME_Y + ptr.y * .12;


    renderer.render(scene, camera);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(() => stage.classList.add('ready'));

  if (REDUCED) {
    for (let n = 0; n < N; n++) {
      pos[n*3]   = home[n*3]   * SCALE;
      pos[n*3+1] = home[n*3+1] * SCALE;
      pos[n*3+2] = 0;
    }
    aPos.needsUpdate = true;
    points.position.set(HOME_X, HOME_Y, 0);
    if (stateL) stateL.textContent = 'Resolved';
    renderer.render(scene, camera);
    return;
  }

  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && raf === null) { t0 = performance.now(); raf = requestAnimationFrame(frame); }
    else if (!e.isIntersecting && raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 }).observe(hero);
}

if (webglOK()) {
  if ('requestIdleCallback' in window) requestIdleCallback(boot, { timeout: 1200 });
  else setTimeout(boot, 200);
}
