/* ==========================================================================
   Hero lab — three treatments of the same hero, for side-by-side comparison.
   Not shippable: the switcher and the stacked sections are lab scaffolding.
   Whichever wins gets lifted into index.html as a single section.
   ========================================================================== */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The engagement, as published. Every line here is on HANDOFF §7's allowed
   list — this illustrates the process, it is NOT live telemetry. */
const STAGES = [
  { when: 'Day 0',    title: 'First call',       note: 'Free 30 minutes. We say whether we are the right team.' },
  { when: '48 hours', title: 'Written proposal', note: 'Scope, price, timeline and assumptions, in writing.' },
  { when: 'Weekly',   title: 'Working demo',     note: 'Software you can click. Every week, in your repos.' },
  { when: '+30 days', title: 'Handover',         note: 'Docs, a walkthrough, and 30 days of support after go-live.' },
];

/* -------------------------------------------------------------------------
   Build the timelines. Horizontal (A, C) and vertical (B) share one dataset.
   ------------------------------------------------------------------------- */
$$('[data-track]').forEach(track => {
  const ol = $('ol', track);
  const vertical = !!$('.spine-fill', track);
  const dark = !!track.closest('#c');

  ol.innerHTML = STAGES.map((s, i) => vertical ? `
    <li class="stage flex gap-4" data-i="${i}">
      <span class="node relative z-10 mt-0.5 grid size-10 shrink-0 place-items-center rounded-full border-2 border-card bg-muted text-xs font-bold text-muted-foreground shadow-sm transition-all duration-500">${i + 1}</span>
      <div class="min-w-0">
        <p class="label text-[11px] font-bold uppercase tracking-[.14em] text-muted-foreground transition-colors duration-500">${s.when}</p>
        <p class="title font-display text-base font-bold text-foreground transition-colors duration-500">${s.title}</p>
        <p class="mt-1 text-sm leading-relaxed text-muted-foreground">${s.note}</p>
      </div>
    </li>` : `
    <li class="stage flex flex-col items-center px-2 text-center" data-i="${i}">
      <span class="node relative z-10 grid size-9 place-items-center rounded-full border-2 ${dark ? 'border-ink-deep bg-white/10 text-ink-foreground' : 'border-card bg-muted text-muted-foreground'} text-xs font-bold shadow-sm transition-all duration-500">${i + 1}</span>
      <p class="label mt-3 text-[11px] font-bold uppercase tracking-[.14em] ${dark ? 'text-ink-foreground/60' : 'text-muted-foreground'} transition-colors duration-500">${s.when}</p>
      <p class="title font-display text-sm font-bold ${dark ? 'text-white' : 'text-foreground'} transition-colors duration-500">${s.title}</p>
    </li>`).join('');

  /* Stage activation is driven from JS rather than four staggered CSS
     animations, so the highlight can never drift out of sync with the
     spine that is drawing beside it. */
  const stages = $$('.stage', ol);
  const ACTIVE_DARK  = ['!bg-accent', '!text-white', '!border-accent', 'shadow-[0_0_22px_-2px_var(--accent)]'];
  const ACTIVE_LIGHT = ['!bg-primary', '!text-primary-foreground', '!border-primary', 'shadow-[0_8px_20px_-6px_var(--primary)]'];
  const ACTIVE = dark ? ACTIVE_DARK : ACTIVE_LIGHT;

  const light = (idx) => stages.forEach((li, i) => {
    const on = i <= idx;
    li.classList.toggle('on', on);
    const node = $('.node', li);
    ACTIVE.forEach(c => node.classList.toggle(c, on));
    $('.title', li)?.classList.toggle(dark ? '!text-white' : '!text-primary', on);
    $('.label', li)?.classList.toggle(dark ? '!text-accent' : '!text-accent-strong', on);
  });

  if (REDUCED) { light(STAGES.length - 1); track.classList.remove('running'); return; }

  let step = -1, timer = null;
  const tick = () => {
    step = (step + 1) % (STAGES.length + 1);
    light(step === STAGES.length ? STAGES.length - 1 : step);
    if (step === STAGES.length) { step = -1; light(-1); }
  };

  /* Only run while the section is on screen — three looping timelines on one
     page is exactly the kind of thing that quietly burns a laptop battery. */
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      if (!timer) { light(-1); step = -1; tick(); timer = setInterval(tick, 9000 / (STAGES.length + 1)); }
      track.classList.add('running');
    } else {
      clearInterval(timer); timer = null;
      track.classList.remove('running');
    }
  }, { threshold: 0.25 });
  io.observe(track);
});

/* -------------------------------------------------------------------------
   Word-by-word headline entrance.
   ------------------------------------------------------------------------- */
$$('[data-split]').forEach(h => {
  let n = 0;
  $$(':scope > span', h).forEach(span => {
    /* Gradient lines animate whole — see the .line note in the stylesheet. */
    if (span.classList.contains('track-grad')) {
      span.classList.add('line');
      span.style.setProperty('--wd', `${n * 70 + 120}ms`);
      return;
    }
    const words = span.textContent.trim().split(/\s+/);
    span.textContent = '';
    words.forEach((w, i) => {
      const el = document.createElement('span');
      el.className = 'word';
      el.style.setProperty('--wd', `${n++ * 70}ms`);
      el.textContent = w;
      span.appendChild(el);
      if (i < words.length - 1) span.appendChild(document.createTextNode(' '));
    });
  });
});

/* The gradient is painted on the parent, so the word spans must not clip it. */
$$('[data-split]').forEach(h => {
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { h.classList.add('in'); io.disconnect(); } }, { threshold: 0 });
  io.observe(h);
});

/* -------------------------------------------------------------------------
   Pointer-driven: aurora parallax, headline gradient position, card tilt,
   magnetic buttons. All one rAF per section.
   ------------------------------------------------------------------------- */
if (!REDUCED) $$('[data-hero]').forEach(hero => {
  const layers = $$('.aurora i', hero);
  const grads  = $$('.track-grad', hero);
  const tilt   = $('[data-tilt]', hero);
  let px = 0, py = 0, queued = false;

  const paint = () => {
    queued = false;
    layers.forEach((el, i) => {
      const d = 26 + i * 16;
      el.style.translate = `${(px * d).toFixed(1)}px ${(py * d * .7).toFixed(1)}px`;
    });
    grads.forEach(g => g.style.setProperty('--gx', `${(50 + px * 55).toFixed(1)}%`));
    if (tilt) tilt.style.transform = `rotateY(${(px * 7).toFixed(2)}deg) rotateX(${(-py * 7).toFixed(2)}deg)`;
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width - 0.5;
    py = (e.clientY - r.top) / r.height - 0.5;
    queue();
  });
  hero.addEventListener('pointerleave', () => { px = 0; py = 0; queue(); });

  /* Magnetic CTA: the button leans toward the cursor as it approaches. */
  $$('.magnetic', hero).forEach(btn => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      btn.style.transform = `translate(${(x * 7).toFixed(1)}px, ${(y * 5).toFixed(1)}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
});

/* -------------------------------------------------------------------------
   Lab switcher
   ------------------------------------------------------------------------- */
const ON = ['bg-primary', 'text-primary-foreground'];
const OFF = ['text-muted-foreground'];
const mark = (id) => $$('.sw').forEach(b => {
  const on = b.dataset.go === id;
  ON.forEach(c => b.classList.toggle(c, on));
  OFF.forEach(c => b.classList.toggle(c, !on));
});
$$('.sw').forEach(b => b.addEventListener('click', () => {
  $('#' + b.dataset.go).scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
}));
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) mark(e.target.id); });
}, { threshold: 0.5 });
$$('[data-hero]').forEach(h => spy.observe(h));
mark('a');

})();
