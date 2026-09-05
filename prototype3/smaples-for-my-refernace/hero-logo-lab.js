/* ==========================================================================
   Mark interaction lab — six ways the cursor can touch the logo.

   All six run on ONE spring-damper model rather than six bespoke effects.
   Each point carries a displacement and a velocity; a mode only decides what
   force the cursor applies. Everything else — the return home, the settling,
   the click burst — falls out of the same integration.

       vel += force(mode) * dt
       vel -= disp * stiffness * dt        (pull home)
       vel *= damping                      (settle)
       disp += vel * dt
       drawn = latticePosition + disp

   That is why "Spring back" is not a separate effect: it is Repel with a
   stiffer spring and heavier damping.

   Also new here: a ShaderMaterial instead of PointsMaterial, which buys
   round dots (PointsMaterial draws squares — visible in the earlier
   screenshots) and a per-point size attribute, without which "Glow only"
   could not swell a dot in place.
   ========================================================================== */
import * as THREE from 'three';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const C = {
  brand:  new THREE.Color('#1f5da0'),
  accent: new THREE.Color('#289dbe'),
  light:  new THREE.Color('#3a7bc8'),
};

/* strength: + pushes away, - pulls in. tangent: swirl. stiffness: how hard it
   returns. damping: how quickly it stops arguing with itself. */
const MODES = {
  repel:   { desc: 'dots are pushed away from the cursor',            strength:  26, tangent: 0,  stiffness: 3,   damping: .90, glow: .25 },
  spring:  { desc: 'pushed away, then snaps back — the mark self-heals', strength: 34, tangent: 0,  stiffness: 16,  damping: .70, glow: .25 },
  attract: { desc: 'dots crowd toward the cursor; the mark stays whole', strength: -20, tangent: 0, stiffness: 5,   damping: .88, glow: .35 },
  vortex:  { desc: 'dots orbit the cursor',                            strength:   4, tangent: 24, stiffness: 6,   damping: .88, glow: .25 },
  ripple:  { desc: 'a wave travels outward from where you point',       strength:   0, tangent: 0,  stiffness: 9,   damping: .82, glow: .2, wave: true },
  glow:    { desc: 'nothing moves — dots swell and brighten in place',  strength:   0, tangent: 0,  stiffness: 14,  damping: .80, glow: 1.5, swell: true },
};

const hero = $('#hero'), stage = $('.stage'), canvas = $('canvas', stage);
const modeName = $('#modeName'), modeDesc = $('#modeDesc');

let modeKey = 'repel';
let isLight = false;
let applyTheme = () => {};

function setMode(k) {
  modeKey = k;
  modeName.textContent = $(`[data-mode="${k}"]`).textContent;
  modeDesc.textContent = MODES[k].desc;
  $$('.md').forEach(b => {
    const on = b.dataset.mode === k;
    b.classList.toggle('bg-accent', on);
    b.classList.toggle('text-white', on);
  });
}
function setTheme(t) {
  isLight = t === 'light';
  document.documentElement.classList.toggle('light', isLight);
  $$('.th').forEach(b => {
    const on = b.dataset.theme === t;
    b.classList.toggle('bg-accent', on);
    b.classList.toggle('text-white', on);
  });
  applyTheme();
}
$$('.md').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
$$('.th').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.theme)));

function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

async function boot() {
  let data;
  try { data = await (await fetch('../logo-points.json')).json(); }
  catch (e) { console.error('logo points unavailable; CSS fallback stands', e); return; }

  const N = data.count, src = data.pos;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  const DPR = Math.min(devicePixelRatio, 2);
  renderer.setPixelRatio(DPR);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 15;

  const unit  = new Float32Array(N * 2);
  const chaos = new Float32Array(N * 3);
  const pos   = new Float32Array(N * 3);
  const col   = new Float32Array(N * 3);
  const base  = new Float32Array(N * 3);   /* colour at rest, for the glow mix */
  const size  = new Float32Array(N);
  const disp  = new Float32Array(N * 3);
  const vel   = new Float32Array(N * 3);

  let SCALE = 4, OFFSET_X = 4.6;
  const FRAME = { w: 14, h: 14 };
  const tmp = new THREE.Color();

  for (let i = 0; i < N; i++) {
    const x = src[i*2], y = src[i*2+1];
    unit[i*2] = x; unit[i*2+1] = y;

    const r = 1.5 + Math.random() * 1.6, th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1);
    chaos[i*3]   = r * Math.sin(ph) * Math.cos(th);
    chaos[i*3+1] = r * Math.sin(ph) * Math.sin(th) * .66;
    chaos[i*3+2] = r * Math.cos(ph) * .35;

    tmp.copy(C.brand).lerp(C.accent, clamp((x + 1) / 2));
    if (Math.random() < .16) tmp.lerp(C.light, .45);
    col[i*3] = base[i*3] = tmp.r;
    col[i*3+1] = base[i*3+1] = tmp.g;
    col[i*3+2] = base[i*3+2] = tmp.b;
    size[i] = 1;
  }
  pos.set(chaos);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  geo.setAttribute('aSize',    new THREE.BufferAttribute(size, 1));

  /* gl_PointSize is device pixels. uSize * uDpr * (60 / dist) with dist ~15
     means uSize ~1.9 lands near 8 CSS px, matching the earlier build. */
  const uni = {
    uSize:    { value: 1.9 },
    uOpacity: { value: .95 },
    uDpr:     { value: DPR },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms: uni,
    transparent: true, depthWrite: false,
    vertexShader: `
      attribute float aSize;
      varying vec3 vColor;
      uniform float uSize, uDpr;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uSize * uDpr * (60.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying vec3 vColor;
      uniform float uOpacity;
      void main() {
        /* round dot with a soft edge — square points were the main reason the
           earlier version read as noise rather than as a printed halftone */
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.32, d);
        if (a < 0.01) discard;
        gl_FragColor = vec4(vColor, a * uOpacity);
      }`,
    vertexColors: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);
  const aPos = geo.getAttribute('position');
  const aCol = geo.getAttribute('color');
  const aSize = geo.getAttribute('aSize');

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

  /* Click burst — one impulse, then the same spring brings it home. */
  let burst = 0, burstX = 0, burstY = 0;
  hero.addEventListener('pointerdown', (e) => {
    const r = hero.getBoundingClientRect();
    burstX = ((e.clientX - r.left) / r.width * 2 - 1) * FRAME.w / 2;
    burstY = (-((e.clientY - r.top) / r.height * 2 - 1)) * FRAME.h / 2;
    burst = 1;
  });

  const resize = () => {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    FRAME.h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    FRAME.w = FRAME.h * camera.aspect;
    const narrow = w < 900;
    SCALE = FRAME.h * (narrow ? .30 : .34);
    OFFSET_X = narrow ? 0 : Math.min(FRAME.w * .26, FRAME.w / 2 - SCALE * 1.05);
    points.position.y = narrow ? FRAME.h * .20 : 0;
  };
  resize();
  addEventListener('resize', resize);

  const ease = (t) => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
  const CYCLE = 13, R = 2.8, DT = 1 / 60;
  let raf = null, t0 = performance.now(), shown = 0, rippleT = 999;

  hero.addEventListener('pointerdown', () => { rippleT = 0; });

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;
    const M = MODES[modeKey];

    const c = (t % CYCLE) / CYCLE;
    const target = c < .38 ? c / .38 : c < .78 ? 1 : 1 - (c - .78) / .22;
    shown += (target - shown) * .08;
    const k = ease(clamp(shown));

    ptr.x += (ptr.tx - ptr.x) * .12;
    ptr.y += (ptr.ty - ptr.y) * .12;
    const cx = ptr.x * FRAME.w / 2, cy = ptr.y * FRAME.h / 2;

    rippleT += DT;
    const waveR = rippleT * 9;                     /* world units per second */

    const rot = (t * .05) * (1 - k);
    const cosR = Math.cos(rot), sinR = Math.sin(rot);
    const active = ptr.inside && !REDUCED;

    for (let n = 0; n < N; n++) {
      const j = n * 3, u = n * 2;

      const ox = unit[u] * SCALE + OFFSET_X, oy = unit[u+1] * SCALE;
      const sx = chaos[j] * SCALE + OFFSET_X, sy = chaos[j+1] * SCALE, sz = chaos[j+2] * SCALE;

      const b = 1 + Math.sin(t * .7 + n * .013) * .09 * (1 - k);
      let bx = (sx + (ox - sx) * k) * b;
      let by = (sy + (oy - sy) * k) * b;
      let bz =  sz + (0 - sz) * k;

      if (rot !== 0) {
        const dx0 = bx - OFFSET_X;
        bx = OFFSET_X + dx0 * cosR - bz * sinR;
        bz = dx0 * sinR + bz * cosR;
      }

      /* ---- forces ---- */
      let fx = 0, fy = 0, fz = 0, near = 0;
      if (active) {
        const dx = (bx + disp[j]) - cx, dy = (by + disp[j+1]) - cy;
        const d2 = dx*dx + dy*dy, d = Math.sqrt(d2) || 1e-4;

        if (M.wave) {
          /* a travelling ring rather than a static field */
          const band = Math.abs(d - waveR);
          if (band < 1.4 && rippleT < 2.2) {
            const amp = (1 - band / 1.4) * (1 - rippleT / 2.2);
            near = amp;
            fx += (dx / d) * amp * 60; fy += (dy / d) * amp * 60; fz += amp * 22;
          }
        } else if (d < R) {
          const f = 1 - d / R;
          near = f * f;
          fx += (dx / d) * near * M.strength;
          fy += (dy / d) * near * M.strength;
          /* tangential component = orbit */
          fx += (-dy / d) * near * M.tangent;
          fy += ( dx / d) * near * M.tangent;
          fz += near * (M.strength > 0 ? 8 : 4);
        }
      }

      if (burst > 0) {
        const dx = bx - burstX, dy = by - burstY;
        const d = Math.sqrt(dx*dx + dy*dy) || 1e-4;
        const f = Math.max(0, 1 - d / 9);
        fx += (dx / d) * f * 260; fy += (dy / d) * f * 260; fz += f * 90;
      }

      /* ---- one integrator for every mode ---- */
      for (let a = 0; a < 3; a++) {
        const i3 = j + a;
        const force = a === 0 ? fx : a === 1 ? fy : fz;
        vel[i3] += (force - disp[i3] * M.stiffness) * DT;
        vel[i3] *= M.damping;
        disp[i3] += vel[i3] * DT;
      }

      pos[j]   = bx + disp[j];
      pos[j+1] = by + disp[j+1];
      pos[j+2] = bz + disp[j+2];

      /* ---- glow / swell ---- */
      const g = near * M.glow;
      size[n] = M.swell ? 1 + near * 2.6 : 1 + g * .6;
      if (g > .002) {
        col[j]   = base[j]   + (1 - base[j])   * clamp(g);
        col[j+1] = base[j+1] + (1 - base[j+1]) * clamp(g);
        col[j+2] = base[j+2] + (1 - base[j+2]) * clamp(g);
      } else {
        col[j] = base[j]; col[j+1] = base[j+1]; col[j+2] = base[j+2];
      }
    }

    burst *= .82;
    if (burst < .01) burst = 0;

    aPos.needsUpdate = true;
    aCol.needsUpdate = true;
    aSize.needsUpdate = true;

    window.__k = k;                       /* test hook: resolve phase */
    points.rotation.y = ptr.x * .05 * (1 - k * .6);
    points.rotation.x = ptr.y * .05 * (1 - k * .6);

    renderer.render(scene, camera);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(() => stage.classList.add('ready'));

  if (REDUCED) {
    for (let n = 0; n < N; n++) {
      pos[n*3] = unit[n*2] * SCALE + OFFSET_X;
      pos[n*3+1] = unit[n*2+1] * SCALE;
      pos[n*3+2] = 0;
    }
    aPos.needsUpdate = true;
    renderer.render(scene, camera);
    return;
  }

  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && raf === null) { t0 = performance.now(); raf = requestAnimationFrame(frame); }
    else if (!e.isIntersecting && raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0 }).observe(hero);
}

setMode('repel');
setTheme('dark');
if (webglOK()) {
  if ('requestIdleCallback' in window) requestIdleCallback(boot, { timeout: 1200 });
  else setTimeout(boot, 200);
}
