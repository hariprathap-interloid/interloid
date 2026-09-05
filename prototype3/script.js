/* ==========================================================================
   Interloid — Prototype 3 behaviour.

   Content lives in the arrays below rather than in hand-duplicated markup, so
   each block converts to a `.map()` in the Next.js port instead of becoming a
   diffing exercise. Class strings are the real Tailwind ones — they move
   across unchanged.
   ========================================================================== */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Lucide 24×24 paths, stroke-width 2, currentColor (HANDOFF §8 — no emoji). */
  const ICON = {
    code: '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
    chart:
      '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    cloud:
      '<path d="M12 2v8"/><path d="m16 6-4 4-4-4"/><path d="M8 16H7a4 4 0 0 1 0-8 5 5 0 0 1 9.7-1.7A4.5 4.5 0 0 1 17 16h-1"/>',
    sparkle:
      '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
    users:
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    doc: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    repeat:
      '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
    shield:
      '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    layers:
      '<path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    rocket:
      '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  };

  const svg = (k, cls) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${ICON[k] || ""}</svg>`;

  /* ==========================================================================
   NAV — §6.1. Width, surface and radius animate together over 300ms.
   ========================================================================== */
  const nav = $("#nav"),
    navInner = $("#navInner");
  const REST = ["max-w-7xl", "px-0"];
  const PILL = [
    "max-w-6xl",
    "px-6",
    "py-2",
    "bg-card/80",
    "backdrop-blur-lg",
    "shadow-lg",
    "border-border",
    "rounded-full",
  ];

  if (nav && navInner) {
    const onScroll = () => {
      const on = window.scrollY > 50;
      navInner.classList.toggle("border-transparent", !on);
      REST.forEach((c) => navInner.classList.toggle(c, !on));
      PILL.forEach((c) => navInner.classList.toggle(c, on));
      nav.classList.toggle("py-6", !on);
      nav.classList.toggle("py-3", on);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
  }

  /* ==========================================================================
   MOBILE MENU — §6.5.
   The icon swap is class-based, never innerHTML, so the click target is never
   detached (HANDOFF §5.3). composedPath() still guards the outside handler.
   ========================================================================== */
  const menu = $("#mobileMenu"),
    toggle = $("#navToggle");
  if (menu && toggle) {
    const iMenu = $('[data-icon="menu"]', toggle),
      iClose = $('[data-icon="close"]', toggle);
    const OPEN = ["visible", "scale-100", "opacity-100"];
    const SHUT = ["invisible", "scale-95", "opacity-0"];
    const isOpen = () => menu.classList.contains("visible");

    const setMenu = (open) => {
      OPEN.forEach((c) => menu.classList.toggle(c, open));
      SHUT.forEach((c) => menu.classList.toggle(c, !open));
      iMenu.classList.toggle("hidden", open);
      iClose.classList.toggle("hidden", !open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setMenu(!isOpen());
    });
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("click", (e) => {
      if (
        isOpen() &&
        !e.composedPath().includes(menu) &&
        !e.composedPath().includes(toggle)
      )
        setMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) {
        setMenu(false);
        toggle.focus();
      }
    });
    matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
      if (e.matches) setMenu(false);
    });
  }

  /* ==========================================================================
   THEME — light-first (theme.css :root), `.dark` on <html> opts in.

   This button is the single source of truth: hero-logo.js OBSERVES the class
   rather than owning it, so the WebGL stage re-tunes its blending (additive
   only brightens and is useless on a pale ground — HANDOFF §5.17) without the
   two ever fighting over who set the theme.

   The icons are two SVGs toggled by class, never innerHTML — §5.3: swapping a
   button's contents detaches the click's original target.

   The hero's orb parallax that used to live here went with the orbs; the mark
   has its own ~20px pointer parallax inside hero-logo.js.
   ========================================================================== */
  const themeBtn = $("#themeToggle");
  if (themeBtn) {
    const moon = $('[data-icon="moon"]', themeBtn);
    const sun = $('[data-icon="sun"]', themeBtn);

    const applyTheme = (dark) => {
      document.documentElement.classList.toggle("dark", dark);
      moon.classList.toggle("hidden", dark);
      sun.classList.toggle("hidden", !dark);
      themeBtn.setAttribute("aria-pressed", String(dark));
      themeBtn.setAttribute(
        "aria-label",
        dark ? "Switch to light theme" : "Switch to dark theme",
      );
      try {
        localStorage.setItem("interloid-theme", dark ? "dark" : "light");
      } catch {}
    };

    /* The head has already set the class from storage / OS preference to avoid
       a flash; this only syncs the button's own state to it. */
    applyTheme(document.documentElement.classList.contains("dark"));
    themeBtn.addEventListener("click", () =>
      applyTheme(!document.documentElement.classList.contains("dark")),
    );
  }

/* ==========================================================================
   SERVICES — §8.6 selector rows + §8.4 feature panel.
   §2.3: one hue per category, reused wherever that category appears.
   ========================================================================== */
  const SERVICES = [
    {
      k: "code",
      name: "Product engineering",
      hue: "brand",
      body: "Web and mobile products built to be handed over — typed, tested, documented, and deployed on infrastructure you control.",
      tags: ["React / Next.js", "TypeScript", "Node / Python", "Postgres"],
    },
    {
      k: "chart",
      name: "Data & analytics",
      hue: "teal",
      body: "Pipelines, warehouses and dashboards that answer the question you actually asked, with the lineage to prove the number.",
      tags: ["Pipelines", "Warehousing", "Dashboards", "Data quality"],
    },
    {
      k: "cloud",
      name: "Cloud & DevOps",
      hue: "light",
      body: "Provisioned as code in your own cloud accounts. CI that runs on every push and a deploy any engineer on your team can trigger.",
      tags: ["AWS", "Terraform", "CI/CD", "Observability"],
    },
    {
      k: "sparkle",
      name: "AI integration",
      hue: "indigo",
      body: "LLM features wired into real workflows — with evaluation, guardrails and a cost model, not a demo that impresses once.",
      tags: ["Retrieval", "Evaluation", "Guardrails", "Cost control"],
    },
    {
      k: "users",
      name: "Team augmentation",
      hue: "accent",
      body: "Senior engineers embedded in your team and your standups. Same people throughout, 30-day notice either way.",
      tags: ["Embedded", "Senior only", "Your process", "30-day notice"],
    },
  ];

  const HUE = {
    brand: {
      tile: "bg-brand",
      soft: "bg-brand/10",
      ring: "ring-brand/15",
      text: "text-brand",
    },
    accent: {
      tile: "bg-accent",
      soft: "bg-accent/10",
      ring: "ring-accent/15",
      text: "text-accent-strong",
    },
    light: {
      tile: "bg-brand-light",
      soft: "bg-brand-light/10",
      ring: "ring-brand-light/15",
      text: "text-brand-light",
    },
    indigo: {
      tile: "bg-indigo-600",
      soft: "bg-indigo-600/10",
      ring: "ring-indigo-600/15",
      text: "text-indigo-600",
    },
    teal: {
      tile: "bg-teal-600",
      soft: "bg-teal-600/10",
      ring: "ring-teal-600/15",
      text: "text-teal-600",
    },
  };

  const selector = $("#selector"),
    panel = $("#panel");
  let active = 0;

  function renderSelector() {
    selector.innerHTML = SERVICES.map((s, i) => {
      const on = i === active,
        h = HUE[s.hue];
      return `<button role="tab" id="tab-${i}" aria-selected="${on}" aria-controls="panel" tabindex="${on ? 0 : -1}" data-i="${i}"
      class="group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300
             ${
               on
                 ? "border-border bg-card shadow-[0_15px_40px_-15px_rgba(31,93,160,.20)]"
                 : "border-transparent hover:border-border hover:bg-card/60"
             }">
      <span class="grid size-11 shrink-0 place-items-center rounded-full transition-colors ${on ? h.tile + " text-white" : h.soft + " " + h.text}">
        ${svg(s.k, "size-5")}
      </span>
      <span class="font-display text-base font-bold ${on ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}">${s.name}</span>
      <span class="ml-auto ${on ? h.text : "text-faint"} transition-transform group-hover:translate-x-1">${svg("arrow", "size-5")}</span>
    </button>`;
    }).join("");
  }

  function renderPanel() {
    const s = SERVICES[active],
      h = HUE[s.hue];
    panel.innerHTML = `
    <div class="pointer-events-none absolute right-0 top-0 size-64 -translate-y-1/3 translate-x-1/3 rounded-full ${h.tile}/10 blur-[80px]"></div>
    <div class="relative z-10">
      <div class="mb-6 flex items-center gap-4">
        <span class="grid size-14 shrink-0 place-items-center rounded-2xl ${h.tile} text-white shadow-lg">${svg(s.k, "size-7")}</span>
        <h3 class="font-display text-2xl font-bold text-foreground md:text-3xl">${s.name}</h3>
      </div>
      <p class="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">${s.body}</p>
      <div class="mb-10 flex flex-wrap gap-2">
        ${s.tags.map((t) => `<span class="rounded-full bg-muted px-3.5 py-1.5 text-sm font-medium text-foreground ring-1 ring-border">${t}</span>`).join("")}
      </div>
      <a href="#contact" class="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-brand-light hover:shadow-primary/40">
        Book a call
        <span class="transition-transform group-hover:translate-x-1">${svg("arrow", "size-4")}</span>
      </a>
    </div>`;
  }

  if (selector && panel) {
    const select = (i) => {
      active = i;
      renderSelector();
      renderPanel();
    };
    renderSelector();
    renderPanel();

    /* Roving tabindex — arrow keys move between tabs, as a tablist requires. */
    selector.addEventListener("click", (e) => {
      const b = e.target.closest("[data-i]");
      if (b) select(+b.dataset.i);
    });
    selector.addEventListener("keydown", (e) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      const next = (active + keys[e.key] + SERVICES.length) % SERVICES.length;
      select(next);
      $(`#tab-${next}`).focus();
    });
  }

  /* ==========================================================================
   STACK MARQUEE — §8.10. List tripled; the keyframe wraps at one third.
   ========================================================================== */
  const STACK = [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "PostgreSQL",
    "AWS",
    "Terraform",
    "Docker",
    "Kubernetes",
    "React Native",
    "GraphQL",
  ];
  const marquee = $("#marquee");
  if (marquee) {
    const item = (n) =>
      `<div class="flex shrink-0 cursor-default items-center gap-3 font-display text-2xl font-bold text-faint transition-colors hover:text-primary">${svg("layers", "size-6")}${n}</div>`;
    marquee.innerHTML = [...STACK, ...STACK, ...STACK].map(item).join("");
    if (REDUCED) marquee.classList.remove("animate-marquee");
  }

  /* ==========================================================================
   ADVANTAGE BENTO — §8.2 glass tiles with cursor spotlight (§14.3).
   Only HANDOFF §7's six allowed numeric claims appear as fact.
   ========================================================================== */
  const BENTO = [
    {
      k: "clock",
      hue: "brand",
      span: "lg:col-span-2",
      title: "A written proposal in 48 hours",
      body: "Scope, price, and a delivery date in writing two working days after the consult. If we can’t commit to it, we tell you then — not three weeks in.",
    },
    {
      k: "repeat",
      hue: "accent",
      span: "",
      title: "A working demo every week",
      body: "Not a status report. Software you can click, every week, from week one.",
    },
    {
      k: "key",
      hue: "indigo",
      span: "",
      title: "You own 100% of the code",
      body: "Your repos, your cloud accounts, your IP — from the first commit, not at handover.",
    },
    {
      k: "shield",
      hue: "teal",
      span: "",
      title: "30 days of post-launch support",
      body: "Included. We stay on after go-live, because that is when real usage finds things.",
    },
    {
      k: "doc",
      hue: "light",
      span: "",
      title: "30-day notice, either direction",
      body: "No lock-in, no minimum term. If it isn’t working, you leave with everything.",
    },
  ];

  const bento = $("#bento");
  if (bento) {
    bento.innerHTML = BENTO.map((b, i) => {
      const h = HUE[b.hue];
      return `<article data-reveal style="--delay:${i * 100}ms" data-spot
      class="group relative overflow-hidden rounded-3xl border border-border bg-card/70 p-8 shadow-sm backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${b.span}">
      <div class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
           style="background:radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(40,157,190,.14), transparent 60%)"></div>
      <div class="relative z-10 flex h-full flex-col">
        <span class="mb-6 grid size-14 place-items-center rounded-2xl ${h.soft} ${h.text} ring-1 ${h.ring} transition-transform duration-500 group-hover:scale-110">${svg(b.k, "size-7")}</span>
        <h3 class="mb-3 font-display text-xl font-bold text-foreground lg:text-2xl">${b.title}</h3>
        <p class="leading-relaxed text-muted-foreground">${b.body}</p>
      </div>
    </article>`;
    }).join("");

    /* §14.3 cursor spotlight */
    if (!REDUCED)
      $$("[data-spot]", bento).forEach((el) => {
        el.addEventListener("pointermove", (e) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${e.clientX - r.left}px`);
          el.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
      });
  }

  /* ==========================================================================
   PROCESS — §8.9. Ghost numeral behind each node.
   ========================================================================== */
  const STEPS = [
    {
      k: "search",
      n: "01",
      title: "Consult",
      when: "Day 0",
      body: "A free 30-minute call. You describe the problem; we tell you whether we are the right team for it.",
    },
    {
      k: "doc",
      n: "02",
      title: "Proposal",
      when: "Within 48h",
      body: "Scope, price, timeline and assumptions in writing. Fixed price or transparent hourly — your choice.",
    },
    {
      k: "code",
      n: "03",
      title: "Build",
      when: "Weekly",
      body: "Two-week cycles with a working demo every week, in your repos and your accounts from commit one.",
    },
    {
      k: "rocket",
      n: "04",
      title: "Handover",
      when: "+30 days",
      body: "Documentation, a walkthrough with your team, and 30 days of support after go-live.",
    },
  ];

  const steps = $("#steps");
  if (steps) {
    steps.innerHTML = STEPS.map(
      (s, i) => `
    <li data-reveal style="--delay:${i * 120}ms" class="group relative flex w-full flex-row items-start lg:w-1/4 lg:flex-col lg:items-center">
      <div class="relative flex shrink-0 items-center justify-center">
        <div class="relative z-10 grid size-[80px] place-items-center rounded-full border-4 border-card bg-card shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_-5px_rgba(31,93,160,.35)]">
          <div class="grid size-14 place-items-center rounded-full bg-brand/10 text-brand ring-1 ring-brand/15">${svg(s.k, "size-6")}</div>
        </div>
        <div class="pointer-events-none absolute -right-4 -top-6 z-0 select-none font-display text-[60px] font-bold text-faint/40 transition-colors group-hover:text-primary/10 lg:-right-8 lg:-top-8 lg:text-[80px]">${s.n}</div>
      </div>
      <div class="ml-8 flex flex-col items-start pt-2 text-left lg:ml-0 lg:mt-10 lg:items-center lg:text-center">
        <span class="mb-2 rounded-full bg-muted px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground ring-1 ring-border">${s.when}</span>
        <h3 class="mb-3 font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary lg:text-2xl">${s.title}</h3>
        <p class="leading-relaxed text-muted-foreground lg:text-sm xl:text-base">${s.body}</p>
      </div>
    </li>`,
    ).join("");
  }

  /* ==========================================================================
   SELECTED WORK — §8.3. Every card is a placeholder: HANDOFF §7 makes three
   real case studies a P0 launch blocker. Do not un-flag these.
   ========================================================================== */
  const CASES = [
    {
      sector: "Logistics",
      hue: "brand",
      title: "Case study one",
      body: "What the problem was, what shipped, and the one number that moved.",
    },
    {
      sector: "Fintech",
      hue: "teal",
      title: "Case study two",
      body: "What the problem was, what shipped, and the one number that moved.",
    },
    {
      sector: "Health",
      hue: "indigo",
      title: "Case study three",
      body: "What the problem was, what shipped, and the one number that moved.",
    },
  ];

  const cases = $("#cases");
  if (cases) {
    cases.innerHTML = CASES.map((c, i) => {
      const h = HUE[c.hue];
      return `<article data-reveal style="--delay:${i * 100}ms" data-placeholder="P0 TRUST: needs a real, anonymised case study"
      class="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
      <div class="relative mb-5 grid h-48 place-items-center overflow-hidden rounded-2xl ${h.soft}">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1.5px,transparent_1.5px)] bg-[size:20px_20px] opacity-40"></div>
        <span class="relative grid size-16 place-items-center rounded-2xl bg-card ${h.text} shadow-md">${svg("layers", "size-8")}</span>
      </div>
      <div class="flex flex-1 flex-col px-4 pb-4">
        <span class="mb-3 text-xs font-semibold uppercase tracking-wide ${h.text}">${c.sector}</span>
        <h3 class="mb-3 font-display text-xl font-bold text-foreground">${c.title}</h3>
        <p class="mb-6 leading-relaxed text-muted-foreground">${c.body}</p>
        <span class="mt-auto inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
          Placeholder <span class="transition-transform group-hover:translate-x-1">${svg("arrow", "size-4")}</span>
        </span>
      </div>
    </article>`;
    }).join("");
  }

  /* ==========================================================================
   CTA PARTICLES — §11.1, 24 drifting dots.
   ========================================================================== */
  const particles = $("#particles");
  if (particles && !REDUCED) {
    /* Deterministic pseudo-random: a seeded LCG, so the layout is identical on
     every load and screenshot diffs stay meaningful. */
    let seed = 7;
    const rnd = () =>
      (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    particles.innerHTML = Array.from({ length: 24 }, () => {
      const size = 1 + rnd() * 3,
        dur = 8 + rnd() * 10;
      return `<span class="absolute rounded-full bg-white" style="
      width:${size.toFixed(1)}px; height:${size.toFixed(1)}px;
      left:${(rnd() * 100).toFixed(1)}%; top:${(rnd() * 100).toFixed(1)}%;
      opacity:${(0.1 + rnd() * 0.2).toFixed(2)};
      animation: orb ${dur.toFixed(1)}s ease-in-out ${(rnd() * 5).toFixed(1)}s infinite;"></span>`;
    }).join("");
  }

  /* ==========================================================================
   SCROLL REVEALS — §13.1. threshold 0 + rootMargin, never a fractional
   threshold: a tall element cannot reach 12% of a shrunken root at 400% zoom
   (HANDOFF §5.6).
   ========================================================================== */
  const revealables = $$("[data-reveal], [data-rail]");
  if (REDUCED) {
    revealables.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target); /* once */
        });
      },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" },
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* ==========================================================================
   SCROLLSPY
   ========================================================================== */
  const links = $$(".nav-link");
  const targets = links.map((l) => $(l.getAttribute("href"))).filter(Boolean);
  if (targets.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((l) => {
            const on = l.getAttribute("href") === `#${e.target.id}`;
            l.classList.toggle("bg-card", on);
            l.classList.toggle("text-primary", on);
            l.classList.toggle("font-semibold", on);
            l.classList.toggle("shadow-sm", on);
            l.classList.toggle("text-muted-foreground", !on);
          });
        });
      },
      { threshold: 0, rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => spy.observe(t));
  }

  /* ==========================================================================
   PLACEHOLDER TOGGLE — HANDOFF §8 convention.
   ========================================================================== */
  const ph = $("#phToggle"),
    phLabel = $("#phLabel");
  if (ph && phLabel) {
    ph.addEventListener("click", () => {
      const on = document.body.classList.toggle("show-ph");
      phLabel.textContent = on ? "Hide placeholders" : "Show placeholders";
      ph.setAttribute("aria-pressed", String(on));
    });
  }
})();
