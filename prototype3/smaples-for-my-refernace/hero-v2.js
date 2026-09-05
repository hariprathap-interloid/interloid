/* ==========================================================================
   Hero directions v2 — two structurally different heroes, not restyles.
   Both ignore DESIGN-SYSTEM.md §7.1's anatomy (orbs / badge / two-tone
   headline / two pills) on purpose: that anatomy is what made every earlier
   attempt read as conversedatasolutions.com. Theme tokens are still the
   single source of colour, so these re-skin from theme.css like everything else.
   ========================================================================== */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Only HANDOFF §7's allowed claims. Nothing here needs sourcing. */
const TERMS = [
  { fig: '48',   unit: 'hours',  label: 'Written proposal',   note: 'Scope, price, timeline and assumptions — before any commitment.' },
  { fig: '1',    unit: '/ week', label: 'Working demo',       note: 'Software you can click, from the first week. Not a status report.' },
  { fig: '100',  unit: '%',      label: 'Code and IP, yours', note: 'Your repos, your cloud accounts, from the first commit.' },
  { fig: '30',   unit: 'days',   label: 'Notice, either way',  note: 'No lock-in, no minimum term. Plus 30 days support after go-live.' },
];

/* --------------------------------------------------------------------------
   Editorial — terms as a set sidebar
   -------------------------------------------------------------------------- */
const edTerms = $('#edTerms');
if (edTerms) {
  edTerms.innerHTML = TERMS.map(t => `
    <div class="border-b border-border pb-4">
      <dt class="font-display text-sm font-bold text-foreground">${t.label}</dt>
      <dd class="mt-1 font-serif text-2xl leading-none text-brand">${t.fig}<span class="ml-1 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">${t.unit}</span></dd>
    </div>`).join('');
}

/* --------------------------------------------------------------------------
   Proof-first — the ledger IS the hero
   -------------------------------------------------------------------------- */
const ledger = $('#ledger');
if (ledger) {
  ledger.innerHTML = TERMS.map((t, i) => `
    <div class="row rise grid grid-cols-12 items-baseline gap-4 py-7 lg:gap-8" style="--d:${180 + i * 110}ms">
      <div class="col-span-12 sm:col-span-4 lg:col-span-3">
        <span class="fig font-display text-[clamp(3rem,7vw,5.5rem)] font-black leading-[.85] tracking-tight text-foreground" data-count="${t.fig}">${t.fig}</span><span class="ml-2 font-display text-xl font-semibold text-accent-strong">${t.unit}</span>
      </div>
      <p class="col-span-12 font-display text-xl font-bold text-foreground sm:col-span-3 lg:col-span-3">${t.label}</p>
      <p class="note col-span-12 text-lg leading-relaxed text-muted-foreground sm:col-span-5 lg:col-span-6">${t.note}</p>
    </div>`).join('');

  /* Count the figures up once, when the ledger arrives. The number is the
     hero here, so it should behave like one. */
  if (!REDUCED) {
    const run = (el) => {
      const target = parseInt(el.dataset.count, 10);
      if (!Number.isFinite(target)) return;
      const dur = 900, t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      el.textContent = '0';
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((es) => es.forEach(e => {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    }), { threshold: 0.6 });
    $$('[data-count]', ledger).forEach(el => io.observe(el));
  }
}

/* --------------------------------------------------------------------------
   Entrances + lab switcher
   -------------------------------------------------------------------------- */
$$('[data-hero]').forEach(sec => {
  if (REDUCED) { sec.classList.add('in'); return; }
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { sec.classList.add('in'); io.disconnect(); }
  }, { threshold: 0.15 });
  io.observe(sec);
});

const mark = (id) => $$('.sw').forEach(b => {
  const on = b.dataset.go === id;
  b.classList.toggle('bg-primary', on);
  b.classList.toggle('text-primary-foreground', on);
  b.classList.toggle('text-muted-foreground', !on);
});
$$('.sw').forEach(b => b.addEventListener('click', () =>
  $('#' + b.dataset.go).scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' })));
const spy = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) mark(e.target.id); }), { threshold: 0.5 });
$$('[data-hero]').forEach(s => spy.observe(s));
mark('ed');

})();
