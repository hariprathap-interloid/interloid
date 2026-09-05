/* ==========================================================================
   Interloid — Prototype 2 shared behaviour (index.html + why-choose-us.html).
   Content is static HTML; this file is behaviour only. Motion follows
   DESIGN-SYSTEM.md §13/§14. Every block is null-guarded so either page can
   omit a component without breaking the rest.
   ========================================================================== */
(() => {
'use strict';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* --- Command bar: contracts on scroll ------------------------------------ */
const cmd = $('#cmd');
if (cmd) {
  const onScroll = () => cmd.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --- Mobile sheet (DS §6.5 detached card) -------------------------------- */
const sheet = $('#sheet'), toggle = $('#cmdToggle'), tIcon = $('#cmdToggleIcon');
if (sheet && toggle && tIcon) {
  const ICON_MENU = '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>';
  const ICON_X    = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
  const setSheet = (open) => {
    sheet.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    tIcon.innerHTML = open ? ICON_X : ICON_MENU;
  };
  /* stopPropagation is load-bearing: the icon swap below detaches the click's
     original target, so without it the document-level outside-click handler
     would read this click as "outside" and instantly re-close the sheet. */
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setSheet(!sheet.classList.contains('is-open'));
  });
  sheet.addEventListener('click', (e) => { if (e.target.closest('a')) setSheet(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheet.classList.contains('is-open')) {
      setSheet(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (sheet.classList.contains('is-open') &&
        !e.composedPath().includes(sheet) && !e.composedPath().includes(toggle)) setSheet(false);
  });
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setSheet(false); });
}

/* --- Scroll reveals (DS §13.1): once, 600ms easeOut, index-staggered ----- */
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
      io.unobserve(entry.target);              /* once: true */
    });
  }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
  revealables.forEach(el => io.observe(el));
}

/* --- Capabilities: horizontal expanding accordion (WAI-ARIA tabs) -------- */
const cap = $('#cap');
if (cap) {
  const tabs   = $$('[role="tab"]', cap);
  const panels = tabs.map(t => cap.querySelector(`#${t.getAttribute('aria-controls')}`));

  const select = (i, focus = true) => {
    tabs.forEach((t, n) => {
      const on = n === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;                /* roving tabindex */
      t.closest('.cap__panel').classList.toggle('is-active', on);
    });
    if (focus) tabs[i].focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i, false));
    tab.addEventListener('keydown', (e) => {
      /* horizontal on desktop, vertical once the accordion linearises */
      const horizontal = matchMedia('(min-width: 1024px)').matches;
      const next = horizontal ? 'ArrowRight' : 'ArrowDown';
      const prev = horizontal ? 'ArrowLeft'  : 'ArrowUp';
      let target = null;
      if (e.key === next)       target = (i + 1) % tabs.length;
      else if (e.key === prev)  target = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') target = 0;
      else if (e.key === 'End')  target = tabs.length - 1;
      if (target === null) return;
      e.preventDefault();
      select(target);
    });
  });
}

/* --- Ladder: the centre spine draws itself once in view ------------------ */
const ladder = $('#ladder');
if (ladder) {
  if (REDUCED) {
    ladder.classList.add('is-in');
  } else {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.2 }).observe(ladder);
  }
}

/* --- Reveal cards: hover handled in CSS, click/keyboard handled here ----- */
$$('.rcard').forEach(card => {
  card.addEventListener('click', () => {
    const open = card.classList.toggle('is-open');
    card.setAttribute('aria-expanded', String(open));
  });
});

/* --- Scrollspy (same-page anchors only) ---------------------------------- */
const links = $$('.cmd__link');
const targets = links
  .map(l => l.getAttribute('href'))
  .filter(h => h && h.startsWith('#'))
  .map(h => document.getElementById(h.slice(1)))
  .filter(Boolean);
if (targets.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  targets.forEach(t => spy.observe(t));
}

/* --- Contact micro-form (index page only) -------------------------------- */
const form = $('#contactForm');
if (form) {
  const setErr = (id, bad) => {
    const el = $(`#${id}`);
    el.closest('.f').classList.toggle('has-error', bad);
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
    ok.focus();                                /* don't strand focus on a hidden button */
  });
  ['name', 'email'].forEach(id => {
    $(`#${id}`).addEventListener('input', () => setErr(id, false));
  });
}

/* --- Placeholder overlay (prototype-only evaluation aid) ----------------- */
const ph = $('#phToggle'), phLabel = $('#phToggleLabel');
if (ph && phLabel) {
  ph.addEventListener('click', () => {
    const on = document.body.classList.toggle('show-ph');
    phLabel.textContent = on ? 'Hide placeholders' : 'Show placeholders';
  });
}

})();
