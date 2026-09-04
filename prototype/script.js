/* ==========================================================================
   Interloid — Design System Prototype
   All content lives in DATA below so copy can be swapped without touching
   markup. Every interaction follows DESIGN-SYSTEM.md §13 / §14.
   ========================================================================== */
(() => {
'use strict';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* --- Lucide-style icon set. No emoji anywhere (review §6.4). ------------- */
const ICON = {
  globe:   '<path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20Z"/><path d="M2 12h20"/>',
  phone:   '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  server:  '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/>',
  cloud:   '<path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 1 0 6.5 19h11Z"/>',
  cpu:     '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2"/>',
  users:   '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  search:  '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  file:    '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v5h5"/><path d="M9 15h6M9 11h3"/>',
  code:    '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
  rocket:  '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.9.7-2.2-.1-3a2.1 2.1 0 0 0-2.9 0Z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.7-6 11a22 22 0 0 1-4 2Z"/><path d="M9 12H4s.5-2.8 2-4c1.7-1.3 5 0 5 0"/>',
  shield:  '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-4 8 4Z"/><path d="m9 12 2 2 4-4"/>',
  lock:    '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  wallet:  '<path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/><path d="M18 12a2 2 0 0 0 0 4h3v-4Z"/>',
  gauge:   '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  handsh:  '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 1 0-2.8l.4-.4a2 2 0 0 1 2.8 0L21 8"/><path d="m21 3-4 4"/><path d="M3 8l3.5-3.5a2 2 0 0 1 2.8 0L14 9"/><path d="M3 21l3-3"/>',
  zap:     '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  arrow:   '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  quote:   '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2-2-2H4c-1.25 0-2 .75-2 2v7c0 1.25.75 2 2 2h3"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2-2-2h-4c-1.25 0-2 .75-2 2v7c0 1.25.75 2 2 2h3"/>',
  layers:  '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
  trend:   '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
};
const svg = (k, cls = '') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k] || ''}</svg>`;

/* ========================================================================
   DATA — swap this out when real content lands. Markup never changes.
   ======================================================================== */
const DATA = {

  /* Placeholder client names. Review §9.4-P1: replace with real logos. */
  clients: ['Northwind', 'Aperture', 'Vertex Labs', 'Kestrel', 'Bluepeak', 'Onyx Health', 'Fieldline'],

  /* Opinionated stack — Vue/Angular removed per review §9.3 */
  tech: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL',
         'AWS', 'Terraform', 'Docker', 'React Native', 'Tailwind', 'OpenAI'],

  services: [
    { id:'web', icon:'globe', color:'#1f5da0', title:'Web Development',
      lead:'Production web applications, live in 8–12 weeks.',
      desc:'We build fast, accessible, SEO-ready platforms on a stack your team can actually maintain — no bespoke framework, no 200-page handover doc.',
      chips:['React','Next.js','TypeScript','PostgreSQL','Vercel','Playwright'] },

    { id:'mobile', icon:'phone', color:'#289dbe', title:'Mobile App Development',
      lead:'One codebase, both stores, no compromise.',
      desc:'React Native apps that feel native, work offline, and ship to review in weeks. We handle store submission, CI and release management too.',
      chips:['React Native','Expo','iOS','Android','Offline-first','Fastlane'] },

    { id:'backend', icon:'server', color:'#14b8a6', title:'Backend & APIs',
      lead:'Infrastructure that survives your growth.',
      desc:'Clean service boundaries, typed contracts, and observability from day one — so scaling is a config change, not a rewrite.',
      chips:['Node.js','Python','REST & GraphQL','PostgreSQL','Redis','OpenAPI'] },

    { id:'cloud', icon:'cloud', color:'#0ea5e9', title:'Cloud & DevOps',
      lead:'Deploys that are boring, on purpose.',
      desc:'Infrastructure as code, automated pipelines, and monitoring that pages a human before your customers notice. AWS Partner Network member.',
      chips:['AWS','Terraform','Docker','GitHub Actions','Grafana','IaC'] },

    { id:'ai', icon:'cpu', color:'#6366f1', title:'AI Integration',
      lead:'AI that does a specific job, measurably.',
      desc:'We start from the workflow, not the model. Retrieval, evaluation harnesses and guardrails so you can prove the thing actually works.',
      chips:['RAG','OpenAI','Vector search','Evals','Guardrails','LangChain'] },

    { id:'team', icon:'users', color:'#8b5cf6', title:'Staff Augmentation',
      lead:'Senior engineers, embedded in your team.',
      desc:'Engineers with 8–12 years each who join your standups, your repo and your review process. Scale up or down with 30 days notice.',
      chips:['Senior only','Your process','Your repo','30-day notice','Overlap hours'] },
  ],

  /* PLACEHOLDER — review §9.4-P0 flags this as the single most critical gap. */
  cases: [
    { tag:'Fintech', icon:'trend', title:'Onboarding cut from 6 days to 4 hours',
      desc:'A UK lender replaced a manual KYC process with an automated pipeline, clearing the backlog inside one quarter.',
      metrics:[{v:'36×',l:'Faster'},{v:'11 wks',l:'To launch'}], hue:'#1f5da0' },
    { tag:'Healthcare', icon:'shield', title:'HIPAA-ready platform rebuilt in 14 weeks',
      desc:'Legacy PHP system re-platformed with audit logging, role-based access and zero downtime during cutover.',
      metrics:[{v:'0',l:'Downtime'},{v:'14 wks',l:'End to end'}], hue:'#14b8a6' },
    { tag:'Logistics', icon:'gauge', title:'Support volume down 58% with AI triage',
      desc:'Retrieval-based assistant handles tier-one queries and routes the rest with full audit trail and human override.',
      metrics:[{v:'58%',l:'Fewer tickets'},{v:'6 wks',l:'To pilot'}], hue:'#6366f1' },
  ],

  process: [
    { n:'01', icon:'search', title:'Discovery call', time:'30 minutes',
      desc:'A free, no-pressure call. We assess feasibility, rough timeline and budget — and tell you if you don\'t need us.', bg:'#eff6ff', fg:'#1f5da0' },
    { n:'02', icon:'file', title:'Written proposal', time:'48 hours',
      desc:'Scope, milestones and a fixed price or transparent hourly rate. In writing, so you can compare it against anyone else.', bg:'#eef2ff', fg:'#6366f1' },
    { n:'03', icon:'code', title:'Build in the open', time:'Weekly demos',
      desc:'Short sprints with a working demo every week. You have access to the repo and the board from day one.', bg:'#ecfeff', fg:'#289dbe' },
    { n:'04', icon:'rocket', title:'Launch & handover', time:'30-day support',
      desc:'We ship it, document it and hand over the keys. 30 days of support included, then a retainer only if you want one.', bg:'#f0fdfa', fg:'#14b8a6' },
  ],

  why: [
    { icon:'lock', wide:true, title:'You own 100% of the code',
      desc:'Every repo, every credential, every architecture decision transfers to you. No proprietary framework, no licence, no hostage situation. It\'s in the contract, not just on this page.' },
    { icon:'wallet', title:'Fixed price or transparent hourly',
      desc:'You know the number before we start. Scope changes are quoted, never surprise-invoiced.' },
    { icon:'users', title:'Senior engineers only',
      desc:'The people on your call are the people writing the code. No bait-and-switch to juniors after signing.' },
    { icon:'handsh', title:'We tell you when to walk away',
      desc:'If your project doesn\'t need us, or needs someone else, we say so on the first call.' },
    /* Exactly ONE wide tile: 2 + 1 + 1 + 1 + 1 = 6 slots = two full rows of 3.
       Adding a second wide tile leaves visible holes in the grid. */
    { icon:'zap', title:'Small team, direct line',
      desc:'You talk to the engineer building your feature — not an account manager relaying messages to a pod.' },
  ],

  /* PLACEHOLDER — review §9.4-P1 */
  quotes: [
    { q:'They pushed back on half our original scope and were right about all of it. We shipped smaller and sooner than we planned.',
      n:'Placeholder Name', r:'VP Product, Placeholder Co', i:'PN' },
    { q:'The handover was the most complete I have received from any vendor. Our team picked it up without a single follow-up call.',
      n:'Placeholder Name', r:'CTO, Placeholder Co', i:'PN' },
    { q:'Weekly demos meant no surprises. We knew exactly where we were the entire build.',
      n:'Placeholder Name', r:'Founder, Placeholder Co', i:'PN' },
  ],

  faq: [
    { q:'What does a typical project cost?',
      a:'Most full builds land between $25k and $90k depending on scope. Staff augmentation runs monthly per engineer. We give you a fixed number in writing within 48 hours of the first call — and we\'ll tell you upfront if your budget and scope don\'t match.' },
    { q:'How long until we launch?',
      a:'A focused first version is typically 8–12 weeks. Larger platforms run 14–20. We work in short sprints with a working demo every week, so you see progress rather than waiting for a reveal.' },
    { q:'Who actually writes the code?',
      a:'Senior engineers with 8–12 years of experience each. The people on your discovery call are the people on your project. We don\'t swap in juniors after the contract is signed.' },
    { q:'What happens if we want to leave?',
      a:'You take everything. All code, infrastructure, documentation and credentials are yours throughout — not handed over at the end. There is no notice period on ownership and nothing is licensed back to you.' },
    { q:'You\'re in India — how does that work across timezones?',
      a:'We keep deliberate overlap with US and UK business hours for standups, demos and anything urgent. Async by default, with a guaranteed live window every working day.' },
    { q:'Can you work with our existing team and codebase?',
      a:'Yes — that\'s most of our staff-augmentation work. We join your repo, your board and your review process rather than running a parallel track.' },
  ],
};

/* ========================================================================
   RENDER
   ======================================================================== */

/* --- Marquees: triple the list so the loop is seamless (§8.10) ---------- */
const renderMarquee = (el, items, icon) => {
  const one = items.map(t =>
    `<span class="marquee__item">${svg(icon)}${t}</span>`).join('');
  el.innerHTML = one + one + one;
};
renderMarquee($('#logoTrack'), DATA.clients, 'layers');
renderMarquee($('#techTrack'), DATA.tech,    'code');

/* --- Services: selector list + panel + mobile carousel (§5.2-C, §8.4) --- */
const listEl = $('#serviceList'), panelEl = $('#servicePanel'), carEl = $('#serviceCarousel');

listEl.innerHTML = DATA.services.map((s, i) => `
  <button class="selector${i === 0 ? ' is-active' : ''}" role="tab"
          aria-selected="${i === 0}" data-index="${i}">
    <span class="selector__l">
      <span class="selector__tile" ${i === 0 ? `style="background:${s.color};"` : ''}>${svg(s.icon)}</span>
      <h3>${s.title}</h3>
    </span>
    <span class="selector__arrow">${svg('arrow')}</span>
  </button>`).join('');

const paintPanel = (s) => `
  <div class="panel__head">
    <span class="panel__tile" style="background:${s.color}">${svg(s.icon)}</span>
    <h3 class="h-panel">${s.title}</h3>
  </div>
  <p class="panel__desc"><strong style="color:var(--slate-700)">${s.lead}</strong><br>${s.desc}</p>
  <div class="panel__chips">${s.chips.map(c => `<span class="chip">${c}</span>`).join('')}</div>
  <a class="btn btn--accent btn--md" href="#contact">
    Discuss this ${svg('arrow', 'arrow')}
  </a>`;

panelEl.innerHTML = paintPanel(DATA.services[0]);

carEl.innerHTML = DATA.services.map(s => `
  <article class="carousel__card">
    <div class="carousel__head">
      <span class="carousel__tile" style="background:${s.color}">${svg(s.icon)}</span>
      <h3 class="h-card">${s.title}</h3>
    </div>
    <p class="body-sm" style="margin-bottom:1.5rem"><strong style="color:var(--slate-700)">${s.lead}</strong><br>${s.desc}</p>
    <div class="panel__chips" style="margin-bottom:1.5rem">
      ${s.chips.slice(0, 4).map(c => `<span class="chip" style="font-size:.75rem;padding:.375rem .75rem">${c}</span>`).join('')}
      ${s.chips.length > 4 ? `<span class="chip" style="font-size:.75rem;padding:.375rem .75rem;color:var(--slate-400)">+${s.chips.length - 4}</span>` : ''}
    </div>
    <a class="btn btn--primary btn--md btn--block" style="margin-top:auto" href="#contact">Discuss this</a>
  </article>`).join('');

/* Panel swap: opacity + blur + y, ~400ms (§8.4) */
let activeService = 0;
const selectService = (i) => {
  if (i === activeService) return;
  activeService = i;
  const s = DATA.services[i];

  $$('.selector', listEl).forEach((b, n) => {
    const on = n === i;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-selected', String(on));
    b.querySelector('.selector__tile').style.background = on ? DATA.services[n].color : '';
  });

  if (REDUCED) { panelEl.innerHTML = paintPanel(s); return; }
  panelEl.classList.add('is-swapping');
  setTimeout(() => {
    panelEl.innerHTML = paintPanel(s);
    requestAnimationFrame(() => panelEl.classList.remove('is-swapping'));
  }, 220);
};

listEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.selector');
  if (btn) selectService(+btn.dataset.index);
});
/* Keyboard support for the tablist */
listEl.addEventListener('keydown', (e) => {
  if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
  e.preventDefault();
  const next = (activeService + (e.key === 'ArrowDown' ? 1 : -1) + DATA.services.length) % DATA.services.length;
  selectService(next);
  $$('.selector', listEl)[next].focus();
});

/* --- Case studies (§8.3) ------------------------------------------------ */
$('#caseGrid').innerHTML = DATA.cases.map(c => `
  <article class="card">
    <div class="card__media">
      <div class="card__media-art" style="background:
        radial-gradient(circle at 30% 20%, ${c.hue}33, transparent 60%),
        linear-gradient(135deg, ${c.hue}1a, #ffffff)"></div>
      <div style="position:relative;z-index:1;color:${c.hue};opacity:.5">
        ${svg(c.icon).replace('<svg', '<svg width="64" height="64"')}
      </div>
      <span class="card__tag">${svg(c.icon)}${c.tag}</span>
    </div>
    <div class="card__body">
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      <div class="metrics">
        ${c.metrics.map(m => `<div><div class="metric__v">${m.v}</div><div class="metric__l">${m.l}</div></div>`).join('')}
      </div>
      <div class="card__foot">
        <span>Read the case study</span>
        <span class="arrow-circle">${svg('arrow')}</span>
      </div>
    </div>
  </article>`).join('');

/* --- Process timeline (§8.9) -------------------------------------------- */
$('#processSteps').innerHTML = DATA.process.map(s => `
  <li class="step">
    <div class="step__nodewrap">
      <div class="step__node">
        <div class="step__inner" style="background:${s.bg};color:${s.fg}">${svg(s.icon)}</div>
      </div>
      <span class="step__num" aria-hidden="true">${s.n}</span>
    </div>
    <div class="step__body">
      <span class="step__time">${s.time}</span>
      <h3>${s.title}</h3>
      <p class="body-sm">${s.desc}</p>
    </div>
  </li>`).join('');

/* --- Why-us bento (§8.2) ------------------------------------------------ */
$('#bentoGrid').innerHTML = DATA.why.map(w => `
  <article class="tile${w.wide ? ' tile--wide' : ''}">
    <div class="tile__spot"></div>
    <div class="tile__tile">${svg(w.icon)}</div>
    <div class="tile__text"><h3>${w.title}</h3><p>${w.desc}</p></div>
  </article>`).join('');

/* Cursor spotlight — alpha .05, subliminal (§14.3) */
$$('.tile').forEach(tile => {
  tile.addEventListener('mousemove', (e) => {
    const r = tile.getBoundingClientRect();
    tile.style.setProperty('--x', `${e.clientX - r.left}px`);
    tile.style.setProperty('--y', `${e.clientY - r.top}px`);
  });
});

/* --- Testimonials ------------------------------------------------------- */
$('#quoteGrid').innerHTML = DATA.quotes.map(t => `
  <figure class="quote">
    <div class="quote__mark">${svg('quote')}</div>
    <blockquote><p>${t.q}</p></blockquote>
    <figcaption class="quote__who">
      <span class="quote__avatar">${t.i}</span>
      <span><strong>${t.n}</strong><span>${t.r}</span></span>
    </figcaption>
  </figure>`).join('');

/* --- FAQ accordion ------------------------------------------------------ */
$('#faqList').innerHTML = DATA.faq.map((f, i) => `
  <div class="faq__item" data-reveal style="--delay:${i * 60}ms">
    <button class="faq__q" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
      <span>${f.q}</span>
      <span class="faq__icon">${svg('chevron')}</span>
    </button>
    <div class="faq__a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">
      <div><p>${f.a}</p></div>
    </div>
  </div>`).join('');

$('#faqList').addEventListener('click', (e) => {
  const btn = e.target.closest('.faq__q');
  if (!btn) return;
  const item = btn.parentElement;
  const open = item.classList.toggle('is-open');
  btn.setAttribute('aria-expanded', String(open));
});

/* --- CTA particles (§11.1) ---------------------------------------------- */
if (!REDUCED) {
  const p = $('#ctaParticles');
  let html = '';
  for (let i = 0; i < 28; i++) {
    const s = 1 + Math.random() * 3;
    html += `<span class="cta__p" style="
      width:${s}px;height:${s}px;
      left:${Math.random() * 100}%;top:${Math.random() * 100}%;
      opacity:${0.1 + Math.random() * 0.2};
      animation:drift ${6 + Math.random() * 8}s ease-in-out ${Math.random() * 5}s infinite"></span>`;
  }
  p.innerHTML = html;
}

/* ========================================================================
   INTERACTIONS
   ======================================================================== */

/* --- Morphing nav (§6.1) ------------------------------------------------ */
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* --- Mobile menu (§6.5) ------------------------------------------------- */
const menu = $('#mobileMenu'), toggle = $('#navToggle'), tIcon = $('#navToggleIcon');
const ICON_MENU = '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>';
const ICON_X    = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
const setMenu = (open) => {
  menu.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  tIcon.innerHTML = open ? ICON_X : ICON_MENU;
};
/* stopPropagation is load-bearing: the icon swap in setMenu detaches the
   click's original target, so this click must not reach the document-level
   outside-click handler (it would misread it as 'outside' and re-close). */
toggle.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!menu.classList.contains('is-open')); });
menu.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
});
document.addEventListener('click', (e) => {
  if (menu.classList.contains('is-open') && !e.composedPath().includes(menu) && !e.composedPath().includes(toggle)) setMenu(false);
});

/* --- Scroll reveals (§13.1): once:true, 600ms easeOut, index stagger ----- */
const revealables = $$('[data-reveal]');
if (REDUCED) {
  revealables.forEach(el => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);            // once: true
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealables.forEach(el => io.observe(el));

  /* Auto-stagger children of grids that weren't given an explicit --delay */
  ['#caseGrid', '#quoteGrid', '#bentoGrid', '.process__steps'].forEach(sel => {
    const parent = $(sel); if (!parent) return;
    [...parent.children].forEach((child, i) => {
      child.setAttribute('data-reveal', '');
      child.style.setProperty('--delay', `${i * 100}ms`);
      io.observe(child);
    });
  });
}

/* --- Process rail draw (§8.9) ------------------------------------------- */
const proc = $('#processBlock');
if (REDUCED) {
  proc.classList.add('is-visible');
} else {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.25 }).observe(proc);
}

/* --- Hero orb parallax (§7.2): keep displacement under 200px ------------- */
if (!REDUCED) {
  const orbs = $$('[data-parallax]');
  let raf = null;
  window.addEventListener('mousemove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 2;
      const dy = (e.clientY / window.innerHeight - 0.5) * 2;
      orbs.forEach(o => {
        const k = parseFloat(o.dataset.parallax);
        o.style.marginLeft = `${dx * k * 70}px`;
        o.style.marginTop  = `${dy * k * 70}px`;
      });
      raf = null;
    });
  }, { passive: true });
}

/* --- Scrollspy: highlight the active nav link --------------------------- */
const sections = ['services', 'work', 'process', 'why', 'faq'].map(id => $(`#${id}`)).filter(Boolean);
const navLinks = $$('.nav__link');
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${e.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

/* --- Form validation ----------------------------------------------------- */
const form = $('#contactForm');
const setErr = (id, bad) => {
  const field = $(`#${id}`).closest('.field') || $(`#${id}`).closest('.consent');
  if (id === 'consent') { $('#err-consent').style.display = bad ? 'block' : 'none'; return; }
  field.classList.toggle('has-error', bad);
  $(`#${id}`).setAttribute('aria-invalid', String(bad));
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const service = $('#service').value;
  const consent = $('#consent').checked;

  const bad = {
    name: !name,
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email),
    service: !service,
    consent: !consent,
  };
  Object.entries(bad).forEach(([k, v]) => setErr(k, v));

  const firstBad = Object.keys(bad).find(k => bad[k]);
  if (firstBad) { $(`#${firstBad}`).focus(); return; }

  form.style.display = 'none';
  $('#formSuccess').classList.add('is-shown');
});

/* Clear the error as soon as the user starts fixing it */
['name', 'email', 'service', 'consent'].forEach(id => {
  const el = $(`#${id}`);
  el.addEventListener('input',  () => setErr(id, false));
  el.addEventListener('change', () => setErr(id, false));
});

/* --- Placeholder overlay (prototype-only evaluation aid) ---------------- */
const rt = $('#reviewToggle'), rtl = $('#reviewToggleLabel');
rt.addEventListener('click', () => {
  const on = document.body.classList.toggle('show-placeholders');
  rt.setAttribute('aria-pressed', String(on));
  rtl.textContent = on ? 'Hide placeholders' : 'Show placeholders';
});

})();
