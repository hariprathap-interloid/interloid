/* ==========================================================================
   WebGL hero directions — three procedural scenes, no assets.

   Rules every scene here obeys, because a hero that costs the page its
   FCP is not worth having (the review measures the live site at 364ms and
   says "do not regress this"):

     · The canvas never blocks the copy. HTML paints, WebGL fades in after.
     · Nothing renders while its section is off-screen.
     · Device pixel ratio is capped at 2 — beyond that is invisible and costly.
     · prefers-reduced-motion and missing WebGL both fall back to the CSS
       gradient already painted underneath. Nothing is ever blank.
   ========================================================================== */
import * as THREE from 'three';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Mirrors theme.css. Three cannot parse oklch(), so these are the sRGB
   equivalents of --brand / --accent / --brand-light / --ink-deep. */
const C = {
  brand:  new THREE.Color('#1f5da0'),
  accent: new THREE.Color('#289dbe'),
  light:  new THREE.Color('#3a7bc8'),
  ink:    new THREE.Color('#020617'),
};

function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

/* --------------------------------------------------------------------------
   Scene harness — sizing, visibility gating, pointer, teardown.
   -------------------------------------------------------------------------- */
function mount(section, build) {
  const stage = $('.stage', section);
  const canvas = $('canvas', stage);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 14;

  const api = build({ scene, camera, renderer, THREE, C });

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  section.addEventListener('pointermove', (e) => {
    const r = section.getBoundingClientRect();
    pointer.tx = (e.clientX - r.left) / r.width * 2 - 1;
    pointer.ty = -((e.clientY - r.top) / r.height * 2 - 1);
  });
  section.addEventListener('pointerleave', () => { pointer.tx = 0; pointer.ty = 0; });

  const resize = () => {
    const w = section.clientWidth, h = section.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    api.resize?.(w, h);
  };
  resize();
  addEventListener('resize', resize);

  let raf = null, t0 = performance.now();
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    pointer.x += (pointer.tx - pointer.x) * 0.06;   /* ease, never snap */
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    api.update((now - t0) / 1000, pointer);
    renderer.render(scene, camera);
  };

  /* First frame paints immediately so the fade-in has something to show,
     then the loop only runs while the section is actually visible. */
  api.update(0, pointer);
  renderer.render(scene, camera);
  requestAnimationFrame(() => stage.classList.add('ready'));

  if (REDUCED) return;                              /* one static frame, done */

  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && raf === null) { t0 = performance.now() - (api.elapsed || 0) * 1000; raf = requestAnimationFrame(frame); }
    else if (!e.isIntersecting && raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }, { threshold: 0.05 }).observe(section);
}

/* ==========================================================================
   1 — ORDER FROM CHAOS
   Every particle holds two positions: a random one and a lattice one. The
   scene eases between them, so the visual states the headline rather than
   decorating it.
   ========================================================================== */
function sceneChaos({ scene, THREE, C }) {
  const N = 4200;
  const chaos = new Float32Array(N * 3);
  const order = new Float32Array(N * 3);
  const pos   = new Float32Array(N * 3);
  const col   = new Float32Array(N * 3);

  /* lattice: a 3D grid, deliberately wider than it is tall */
  const gx = 28, gy = 12, gz = 12;
  const sp = 0.62;
  let i = 0;
  for (let x = 0; x < gx && i < N; x++)
    for (let y = 0; y < gy && i < N; y++)
      for (let z = 0; z < gz && i < N; z++, i++) {
        order[i*3]   = (x - gx/2) * sp;
        order[i*3+1] = (y - gy/2) * sp;
        order[i*3+2] = (z - gz/2) * sp;
      }
  for (; i < N; i++) {                              /* any remainder */
    order[i*3] = (Math.random()-.5)*gx*sp;
    order[i*3+1] = (Math.random()-.5)*gy*sp;
    order[i*3+2] = (Math.random()-.5)*gz*sp;
  }

  const tmp = new THREE.Color();
  for (let k = 0; k < N; k++) {
    const r = 9 + Math.random() * 7, th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1);
    chaos[k*3]   = r * Math.sin(ph) * Math.cos(th);
    chaos[k*3+1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
    chaos[k*3+2] = r * Math.cos(ph);
    tmp.copy(C.brand).lerp(C.accent, Math.random());
    col[k*3] = tmp.r; col[k*3+1] = tmp.g; col[k*3+2] = tmp.b;
  }
  pos.set(chaos);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.075, vertexColors: true, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const attr = geo.getAttribute('position');
  const ease = (t) => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;

  return {
    elapsed: 0,
    update(t, p) {
      this.elapsed = t;
      /* 0 -> 1 -> 0 over 11s: scatter, resolve, hold, scatter again */
      const cyc = (t % 11) / 11;
      const k = ease(cyc < .45 ? cyc/.45 : cyc < .75 ? 1 : 1 - (cyc-.75)/.25);
      for (let n = 0; n < N; n++) {
        const j = n*3;
        const w = 1 + Math.sin(t*0.7 + n*0.015) * 0.12;   /* never fully still */
        pos[j]   = (chaos[j]   + (order[j]   - chaos[j])   * k) * w;
        pos[j+1] = (chaos[j+1] + (order[j+1] - chaos[j+1]) * k) * w;
        pos[j+2] = (chaos[j+2] + (order[j+2] - chaos[j+2]) * k);
      }
      attr.needsUpdate = true;
      points.rotation.y = t * 0.06 + p.x * 0.35;
      points.rotation.x = p.y * 0.22;
    },
  };
}

/* ==========================================================================
   2 — NETWORK MESH
   Nodes drift; an edge is drawn whenever two come within range. Reads as a
   dependency graph rather than a starfield.
   ========================================================================== */
function sceneMesh({ scene, THREE, C }) {
  const N = 88, RANGE = 4.6, BOUND = 11;
  const p = [], v = [];
  for (let i = 0; i < N; i++) {
    p.push(new THREE.Vector3((Math.random()-.5)*BOUND*2, (Math.random()-.5)*BOUND, (Math.random()-.5)*BOUND));
    v.push(new THREE.Vector3((Math.random()-.5)*.02, (Math.random()-.5)*.02, (Math.random()-.5)*.02));
  }

  const nodePos = new Float32Array(N*3);
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
  const nodes = new THREE.Points(nodeGeo, new THREE.PointsMaterial({
    size: .16, color: C.accent, transparent: true, opacity: .95,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  scene.add(nodes);

  const MAXE = N * 10;
  const linePos = new Float32Array(MAXE * 6);
  const lineCol = new Float32Array(MAXE * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3));
  const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: .5,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  scene.add(lines);

  const group = new THREE.Group();
  scene.add(group); group.add(nodes); group.add(lines);

  return {
    elapsed: 0,
    update(t, ptr) {
      this.elapsed = t;
      for (let i = 0; i < N; i++) {
        p[i].add(v[i]);
        if (Math.abs(p[i].x) > BOUND*1.4) v[i].x *= -1;
        if (Math.abs(p[i].y) > BOUND*.7)  v[i].y *= -1;
        if (Math.abs(p[i].z) > BOUND*.7)  v[i].z *= -1;
        nodePos[i*3] = p[i].x; nodePos[i*3+1] = p[i].y; nodePos[i*3+2] = p[i].z;
      }
      nodeGeo.getAttribute('position').needsUpdate = true;

      let e = 0;
      for (let i = 0; i < N && e < MAXE; i++) {
        for (let j = i+1; j < N && e < MAXE; j++) {
          const d = p[i].distanceTo(p[j]);
          if (d > RANGE) continue;
          const a = 1 - d / RANGE;                  /* closer = brighter */
          const o = e*6;
          linePos[o]   = p[i].x; linePos[o+1] = p[i].y; linePos[o+2] = p[i].z;
          linePos[o+3] = p[j].x; linePos[o+4] = p[j].y; linePos[o+5] = p[j].z;
          const c = C.brand.clone().lerp(C.accent, a);
          lineCol[o]   = c.r*a; lineCol[o+1] = c.g*a; lineCol[o+2] = c.b*a;
          lineCol[o+3] = c.r*a; lineCol[o+4] = c.g*a; lineCol[o+5] = c.b*a;
          e++;
        }
      }
      lineGeo.setDrawRange(0, e*2);
      lineGeo.getAttribute('position').needsUpdate = true;
      lineGeo.getAttribute('color').needsUpdate = true;

      group.rotation.y = t*0.045 + ptr.x*0.4;
      group.rotation.x = ptr.y*0.25;
    },
  };
}

/* ==========================================================================
   3 — SHADER FIELD
   One full-screen triangle, all the work in the fragment shader. No geometry,
   no per-frame CPU cost. This is the cheap one.
   ========================================================================== */
function sceneField({ scene, camera, THREE, C }) {
  camera.position.z = 1;
  const uniforms = {
    uTime:   { value: 0 },
    uPtr:    { value: new THREE.Vector2(0, 0) },
    uRes:    { value: new THREE.Vector2(1, 1) },
    uBrand:  { value: new THREE.Color().copy(C.brand) },
    uAccent: { value: new THREE.Color().copy(C.accent) },
    uLight:  { value: new THREE.Color().copy(C.light) },
    uInk:    { value: new THREE.Color().copy(C.ink) },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime; uniform vec2 uPtr, uRes;
      uniform vec3 uBrand, uAccent, uLight, uInk;

      vec2 hash(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
        return -1.0 + 2.0*fract(sin(p)*43758.5453123); }
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(dot(hash(i+vec2(0,0)), f-vec2(0,0)), dot(hash(i+vec2(1,0)), f-vec2(1,0)), u.x),
                   mix(dot(hash(i+vec2(0,1)), f-vec2(0,1)), dot(hash(i+vec2(1,1)), f-vec2(1,1)), u.x), u.y);
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 5; i++) { v += a*noise(p); p *= 2.02; a *= 0.5; }
        return v;
      }

      void main(){
        vec2 uv = vUv;
        vec2 p = (uv - 0.5) * vec2(uRes.x/uRes.y, 1.0) * 2.4;
        p += uPtr * 0.28;

        float t = uTime * 0.055;
        /* domain warp: flow rather than static clouds */
        vec2 q = vec2(fbm(p + t), fbm(p + vec2(3.2, 1.7) - t));
        float f = fbm(p + q*1.9 + vec2(t*0.6, -t*0.4));
        f = smoothstep(-0.35, 0.55, f);

        vec3 col = mix(uInk, uBrand, smoothstep(0.05, 0.75, f));
        col = mix(col, uAccent, smoothstep(0.45, 0.95, f) * 0.75);
        col = mix(col, uLight, smoothstep(0.7, 1.0, f) * 0.35);

        /* keep the left third dark so the copy always has ground */
        col = mix(uInk, col, smoothstep(0.02, 0.6, uv.x));
        /* vignette */
        col *= 1.0 - 0.5 * pow(length(uv - 0.5) * 1.35, 2.0);

        gl_FragColor = vec4(col, 1.0);
      }`,
    depthTest: false, depthWrite: false,
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1,-1,0, 3,-1,0, -1,3,0]), 3));
  geo.setAttribute('uv',       new THREE.BufferAttribute(new Float32Array([0,0, 2,0, 0,2]), 2));
  scene.add(new THREE.Mesh(geo, mat));

  return {
    elapsed: 0,
    resize(w, h) { uniforms.uRes.value.set(w, h); },
    update(t, p) { this.elapsed = t; uniforms.uTime.value = t; uniforms.uPtr.value.set(p.x, p.y); },
  };
}

/* ==========================================================================
   Boot — after first paint, never before.
   ========================================================================== */
const BUILDERS = { chaos: sceneChaos, mesh: sceneMesh, field: sceneField };

if (webglOK()) {
  const start = () => $$('[data-scene]').forEach(sec => {
    try { mount(sec, BUILDERS[sec.dataset.scene]); }
    catch (err) { console.error('scene failed, CSS fallback stands:', sec.id, err); }
  });
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1200 });
  else setTimeout(start, 200);
}

/* switcher */
const mark = (id) => $$('.sw').forEach(b => {
  const on = b.dataset.go === id;
  b.classList.toggle('bg-accent', on);
  b.classList.toggle('text-white', on);
  b.classList.toggle('text-ink-foreground', !on);
});
$$('.sw').forEach(b => b.addEventListener('click', () =>
  $('#' + b.dataset.go).scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' })));
new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) mark(e.target.id); }), { threshold: 0.5 })
  .observe && $$('[data-scene]').forEach(s =>
    new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) mark(e.target.id); }), { threshold: 0.5 }).observe(s));
mark('chaos');
