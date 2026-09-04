/* ==========================================================================
   Interloid — "Why Choose Us" page behaviour.
   Content lives in the HTML (this page is bespoke editorial copy, unlike the
   homepage prototype's DATA-driven collections). This file handles behaviour
   only: nav morph, mobile menu, scroll reveals, process rail, accordion,
   scrollspy, CTA particles and the placeholder overlay.
   All motion follows DESIGN-SYSTEM.md §13/§14.
   ========================================================================== */
(() => {
'use strict';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* --- Morphing nav (§6.1) ------------------------------------------------ */
const nav = $('#nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --- Mobile menu (§6.5) ------------------------------------------------- */
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
  /* stopPropagation is load-bearing: the icon swap above detaches the click's
     original target, so if this click reached the document-level outside-click
     handler, toggle.contains(e.target) would be false and the menu would
     immediately re-close. */
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
}

/* --- Scroll reveals (§13.1): once, 600ms easeOut, index-staggered -------- */
/* [data-stagger] containers get their children auto-wired with 100ms steps. */
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
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealables.forEach(el => io.observe(el));
}

/* --- Process rail draw (§8.9) ------------------------------------------- */
const proc = $('#processBlock');
if (proc) {
  if (REDUCED) {
    proc.classList.add('is-visible');
  } else {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.25 }).observe(proc);
  }
}

/* --- Questions accordion ------------------------------------------------- */
const questions = $('#questions');
if (questions) {
  questions.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq__q');
    if (!btn) return;
    const item = btn.closest('.faq__item');
    const open = item.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
}

/* --- Scrollspy ----------------------------------------------------------- */
const sections = ['difference', 'principles', 'process', 'questions']
  .map(id => document.getElementById(id)).filter(Boolean);
const navLinks = $$('.nav__link');
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${e.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

/* --- CTA particles (§11.1) ----------------------------------------------- */
if (!REDUCED) {
  const p = $('#ctaParticles');
  if (p) {
    let html = '';
    for (let i = 0; i < 26; i++) {
      const s = 1 + Math.random() * 3;
      html += `<span class="cta__p" style="
        width:${s}px;height:${s}px;
        left:${Math.random() * 100}%;top:${Math.random() * 100}%;
        opacity:${0.1 + Math.random() * 0.2};
        animation:drift ${6 + Math.random() * 8}s ease-in-out ${Math.random() * 5}s infinite"></span>`;
    }
    p.innerHTML = html;
  }
}

/* --- Placeholder overlay (prototype-only evaluation aid) ------------------ */
const rt = $('#reviewToggle'), rtl = $('#reviewToggleLabel');
if (rt && rtl) {
  rt.addEventListener('click', () => {
    const on = document.body.classList.toggle('show-placeholders');
    rt.setAttribute('aria-pressed', String(on));
    rtl.textContent = on ? 'Hide placeholders' : 'Show placeholders';
  });
}

})();
