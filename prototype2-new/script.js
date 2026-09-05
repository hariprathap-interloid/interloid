/* ==========================================================================
   Interloid — Prototype 2 shared behaviour (index.html + why-choose-us.html).
   Content is static HTML; this file is behaviour only. All motion follows
   DESIGN-SYSTEM.md §13/§14. Every block is null-guarded so either page can
   omit a component without breaking the rest.
   ========================================================================== */
(() => {
'use strict';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* --- Nav: transparent → glass surface with hairline on scroll ------------ */
const nav = $('#nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --- Mobile menu (§6.5 detached card) ------------------------------------ */
const menu = $('#mobileMenu'), toggle = $('#navToggle'), tIcon = $('#navToggleIcon');
if (menu && toggle && tIcon) {
  const ICON_MENU = '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>';
  const ICON_X    = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    tIcon.innerHTML = open ? ICON_X : ICON_MENU;
  };
  /* stopPropagation is load-bearing: the icon swap detaches the click's
     original target; without it the document-level outside-click handler
     would misread this click as "outside" and instantly re-close the menu. */
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(!menu.classList.contains('is-open'));
  });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('is-open') && !e.composedPath().includes(menu) && !e.composedPath().includes(toggle)) setMenu(false);
  });
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });
}

/* --- Scroll reveals (§13.1): once, 600ms easeOut, index-staggered -------- */
$$('[data-stagger]').forEach(parent => {
  [...parent.children].forEach((child, i) => {
    if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', '');
    if (!child.style.getPropertyValue('--delay')) child.style.setProperty('--delay', `${i * 100}ms`);
  });
});

const revealables = $$('[data-reveal]');
if (REDUCED) {
  revealables.forEach(el => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);            /* once: true */
    });
  }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
  revealables.forEach(el => io.observe(el));
}

/* --- Scrollspy (same-page anchors only) ---------------------------------- */
const navLinks = $$('.nav__link');
const spyTargets = navLinks
  .map(l => l.getAttribute('href'))
  .filter(h => h && h.startsWith('#'))
  .map(h => document.getElementById(h.slice(1)))
  .filter(Boolean);
if (spyTargets.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  spyTargets.forEach(s => spy.observe(s));
}

/* --- Micro-form (index page only) ----------------------------------------- */
const form = $('#contactForm');
if (form) {
  const setErr = (id, bad) => {
    const el = $(`#${id}`);
    el.closest('.field').classList.toggle('has-error', bad);
    el.setAttribute('aria-invalid', String(bad));
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = {
      name: !$('#name').value.trim(),
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#email').value.trim()),
    };
    Object.entries(bad).forEach(([k, v]) => setErr(k, v));
    const firstBad = Object.keys(bad).find(k => bad[k]);
    if (firstBad) { $(`#${firstBad}`).focus(); return; }
    form.style.display = 'none';
    const ok = $('#formSuccess');
    ok.classList.add('is-shown');
    ok.focus();
  });
  ['name', 'email'].forEach(id => {
    $(`#${id}`).addEventListener('input', () => setErr(id, false));
  });
}

/* --- Version switcher: Base (Prototype 2) vs V1 (DESIGN-SYSTEM.md layout) - */
const verBtns = $$('.ver-toggle button');
if (verBtns.length) {
  const setVersion = (v) => {
    document.documentElement.classList.toggle('v1', v === 'v1');
    verBtns.forEach(b => {
      const on = b.dataset.ver === v;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    try { localStorage.setItem('interloid-p2-version', v); } catch (e) {}
  };
  verBtns.forEach(b => b.addEventListener('click', () => setVersion(b.dataset.ver)));
  /* sync the control with whatever the early head script decided */
  setVersion(document.documentElement.classList.contains('v1') ? 'v1' : 'base');
}

/* --- Placeholder overlay (prototype-only evaluation aid) ------------------ */
const rt = $('#reviewToggle'), rtl = $('#reviewToggleLabel');
if (rt && rtl) {
  rt.addEventListener('click', () => {
    const on = document.body.classList.toggle('show-placeholders');
    rtl.textContent = on ? 'Hide placeholders' : 'Show placeholders';
  });
}

})();
