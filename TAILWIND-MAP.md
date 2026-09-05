# Next.js Port Notes — Prototype 3

**Decisions (2026-09-05):** the app is **Next.js + Tailwind v4**. Prototype 3 is
written *in Tailwind already*, so there is no CSS translation step — only a JSX
and hooks step.

> **Updated 2026-09-06 — the port starts NOW, not after design signoff.** Only
> nav + hero are approved; every further prototype pass would be a pass run
> twice. `prototype3/` is a reference artifact from here: read it, port from it,
> do not extend it. Rationale, the section order and the deliberately-deferred
> verification list are in **HANDOFF §4a** — read that before this file.

**Why:** `DESIGN-SYSTEM.md` §0 specifies Tailwind v4 (`@theme`, oklch), and a live
probe of conversedatasolutions.com confirmed the reference site is itself Tailwind
v4 (`min-h-screen`, `py-24 bg-white`, oklch computed values). Prototypes 1–2 were
a hand-translation *away* from that notation. Prototype 3 returns to it.

---

## 1. Palette

`--slate-*` throughout is **Tailwind v4's stock slate** (oklch-derived). Verified
against both `DESIGN-SYSTEM.md` §2.2 and the live site.

> ⚠️ **Pin v4.** On v3 these differ (`v3 slate-500 = #64748b` vs `v4 #62748e`).
> Every neutral on the page shifts, silently, with nothing visibly broken.
> This is the highest-risk item in the port.

Only these are not stock — they live in `prototype3/theme.css`:

```css
:root {
  --primary / --brand:  #1f5da0   /* Interloid blue */
  --brand-light:        #3a7bc8
  --accent:             #289dbe   /* display sizes, icons, borders only */
  --accent-strong:      #1b7c99   /* AA-safe accent at body size (4.6:1) */
  --background:         #f7f9fc   /* tinted, NOT white */
  --card:               #ffffff
  --secondary:          #eef3f9   /* alternating section */
  --ink / --ink-deep:   #0f172a / #020617
}
```

> **Accent — corrected (2026-09-05).** An earlier note here claimed `#289dbe`
> was drift. That was wrong. Probing **interloid.com** found `#1f5da0` (28 text
> uses, 4 backgrounds, 3 borders) and `#289dbe` (24 text uses) with
> `linear-gradient(135deg, #1f5da0, #289dbe)` in 11+ places — Interloid's real
> brand. `#06b6d4` is *Converse's* accent and was imported by mistake.
> Prototypes 1–2 had this right. P3 now uses Interloid's palette.
>
> Contrast rule stands: `#289dbe` is 3.15:1 on white — display sizes, icons and
> borders only. Body-size accent text must use `--accent-strong` (#1b7c99).

---

## 2. What ports as-is

Everything visual. Class strings move to JSX unchanged; `class` → `className`.
The `@theme` block moves into `app/globals.css`. The `<style>` block (reveals,
rail, focus rings, placeholder outliner, reduced-motion) moves with it verbatim.

---

## 3. What must NOT become utility classes

Keep as real CSS. Utility-ising these is where fidelity actually dies:

1. **Scroll-reveal + rail transitions** — they use `var(--delay)` per element.
2. **`prefers-reduced-motion`** — the prototype flattens whole components at once;
   Tailwind's `motion-reduce:` variant is per-utility.
3. **`:focus-visible` ring composition** — HANDOFF §5.2: a component's own shadow
   out-cascades the ring, so the fix is a *composed* multi-shadow. Utilities
   cannot express that.
4. **Keyframes** (`gradient`, `marquee`, `orb`).

---

## 4. The real work: `script.js` → hooks

~380 lines. The content arrays (`SERVICES`, `BENTO`, `STEPS`, `CASES`, `STACK`)
were written to become `.map()` calls — lift them to module scope or a CMS.

| Prototype | Next.js |
| --- | --- |
| Nav class toggling on scroll | `useState` + `useEffect` scroll listener |
| Selector `renderSelector/renderPanel` | `useState(active)` + JSX |
| `IntersectionObserver` reveals | `useEffect` hook, or Framer Motion `whileInView` |
| Mobile menu class toggles | `useState(open)` |
| Cursor spotlight `pointermove` | `useRef` + handler on the card |

**Every `useEffect` needs a cleanup.** Without one, hot reload stacks scroll and
IntersectionObserver listeners — a failure mode the static prototype cannot have.

`DESIGN-SYSTEM.md` §0 names **Framer Motion** for reveals. Adopting it replaces
the `[data-reveal]` CSS with `whileInView` and removes the observer hook entirely;
the vocabulary (`opacity 0→1, y 20→0, 600ms, once, 100ms stagger`) is unchanged.

---

## 4b. Port status — 2026-09-06

**The whole page is ported.** Sections 02-08 landed 2026-09-06. `next-js/` runs Next **16.3.4** with
React 19.2.8 and Tailwind v4 (`@tailwindcss/postcss`). Note `next-js/AGENTS.md`:
this Next is newer than most training data — read `node_modules/next/dist/docs/`
before writing app code, and expect conventions like `LayoutProps<"/">`.

| File | What |
| --- | --- |
| `src/app/globals.css` | The three prototype CSS blocks merged into one, per §5 |
| `src/app/layout.tsx` | Fonts, metadata, the pre-paint theme script |
| `src/components/Nav.tsx` | Client. Morph, mobile menu, theme toggle |
| `src/components/Hero.tsx` | **Server** — no JS ships for the hero markup |
| `src/components/HeroStage.tsx` | Client. WebGL mark, `three` code-split |
| `src/components/Reveal.tsx` | Client. `[data-reveal]` observer |
| `src/components/Services.tsx` | **Client** — ARIA tablist, roving tabindex |
| `src/components/Advantage.tsx` | **Client** — cursor spotlight only |
| `src/components/StackMarquee.tsx` | Server |
| `src/components/Process.tsx` | Server |
| `src/components/Work.tsx` | Server — every card is a §7 P0 placeholder |
| `src/components/CtaAnchor.tsx` | Server — particles generated at build |
| `src/components/Footer.tsx` | Server |
| `src/components/SectionHeading.tsx` | Server — the eyebrow + two-tone H2, was four copies |
| `src/components/Icon.tsx` | The Lucide set |
| `src/content/site.ts` | SERVICES / STACK / BENTO / STEPS / CASES / HUE |
| `src/components/PlaceholderToggle.tsx` | Client |
| `src/fonts/Satoshi-*.woff2` | Self-hosted, 4 weights, ~100 KB |
| `.verify.mjs` / `.perf.mjs` | `npm run verify` / `npm run perf` |

### The budget question is answered

**FCP 236ms median over 5 runs against a 364ms budget, on 25 requests versus
the live site's 37** (it was 168ms with only the hero ported; the full page
costs ~70ms more and still clears the budget) (production build, `npm start`). The WebGL hero was the
single highest-risk item in the port and it does not regress first paint. That
is what porting it first was for.

Two things bought that:

- **`three` never enters the initial bundle.** `HeroStage` does
  `await import("three")` inside an effect behind `requestIdleCallback`, so it
  is code-split and lands after first paint.
- **Both faces are self-hosted.** Inter via `next/font/google`, Satoshi via
  `next/font/local` from `src/fonts/`. This removes BOTH font origins from the
  critical path — including `api.fontshare.com`, which HANDOFF §8 flagged as an
  extra DNS+TLS handshake.

### Fidelity: verified identical, not assumed

`.fidelity.mjs` at the repo root (needs `npm start` on :3000, then
`node .fidelity.mjs`) serves `prototype3/` alongside the production build and
compares them element by element — 27 nodes including `<html>` and `<body>`,
each on **42 computed properties plus its bounding box**, in **both themes**.

**Result: IDENTICAL across the whole page — 614 elements, both themes.**
Every box matches to the pixel and every property matches after normalisation.
Page height 6167px on both sides. Because the boxes match exactly, the self-hosted
Satoshi is provably rendering with the same metrics as the Fontshare CDN copy —
different family *name*, same font file.

Two normalisations were needed, and both are measurement artifacts rather than
differences worth keeping:

1. **Colour serialisation.** The prototype's browser-CDN Tailwind leaves colours
   as `oklch()`; the compiled build emits `lab()` for the identical colour. The
   check resolves every colour through a 1×1 canvas so it compares pixels, not
   spellings. This accounted for ~120 of the first run's 126 "differences".
2. **`.scroll-cue` is animated** — a 2.4s infinite 0→6px bob — so its box
   differed by wherever each page sat in the loop. Animations are frozen and
   the cue reset to its 0% keyframe before measuring.

The only intentional CSS difference in the whole port is `--font-sans` /
`--font-display`, which now point at `next/font` variables instead of literal
family names. A static token diff confirms all **66 tokens** and every selector
came across; nothing was dropped.

It aligns by **path, not index** — a single extra node shifts every later index
and turns one real difference into hundreds of phantom ones (the first
whole-page run reported 1943). Re-run it after every change to markup.

### What the whole-page run caught

Three real defects, none of which a screenshot would have shown:

1. **The scrollspy was missing entirely.** `script.js` marked the nav link for
   whichever section is in the reading band (`bg-card text-primary
   font-semibold shadow-sm`, `rootMargin: -45% 0px -50%`). It had simply not
   been ported; the diff surfaced it as four property differences on one link.
2. **A curly apostrophe.** "Let&rsquo;s talk" instead of the prototype's
   straight "Let's talk" — a different glyph, so the button measured 108.672px
   against 107.219px and shifted every nav item beside it.
3. **Icon path structure.** The hamburger is three separate `<path>` elements
   and the close icon two; both had been collapsed into single multi-segment
   paths. Visually identical, structurally not, and it broke tree alignment.

### Server vs Client

Only **Nav, Services, Advantage, HeroStage, Reveal and PlaceholderToggle** are
Client Components. Everything else is server-rendered HTML with no JavaScript.
Notably the CTA slab's 24 particles use a seeded LCG, so they are deterministic
and are generated at **build** time — same output as the prototype's runtime
loop, zero client cost.

Reveals were verified separately (`.rev.mjs`): 5/28 elements revealed at load
and 28/28 after a scroll, identical on both sides. A `fullPage` screenshot
races the observer and leaves lower sections blank — that is a capture
artifact, not a bug.

### Fixed during the port

- **Nav breakpoint mismatch.** The prototype closed the mobile menu at a
  `matchMedia("(min-width: 1024px)")` change, but the desktop pill only appears
  at `xl:` (1280px) — so between 1024 and 1279 it shut the *only* navigation on
  that viewport. Now 1280.
- **Duplicated CSS.** `index.html` carried its non-utility block twice — lines
  111-163 were byte-identical to the head of the surviving block (verified by
  diff). Ported once.
- **`setState` in an effect.** The theme started as `useState` mirrored from the
  DOM on mount; `react-hooks/set-state-in-effect` rejected it, correctly. The
  `.dark` class is genuinely external state — written by the inline script
  before hydration and read by `HeroStage` — so it is now a
  `useSyncExternalStore` subscription over a `MutationObserver`.

### Also fixed

- **`bg-brand/10` would have vanished.** The prototype built the panel's glow
  at runtime as `${h.tile}/10`, which only worked because the Tailwind
  **browser CDN** generates classes on the fly. A compiled build scans source
  for whole class strings, so a concatenated one is invisible and gets dropped
  silently. `HUE` now carries a literal `glow` for each hue. **Never rebuild a
  class by concatenation in a compiled build.**
- **Duplicate `<meta>`.** Hand-written charset and viewport tags in `layout.tsx`
  produced two of each in the rendered HTML — Next injects both. Removed; the
  values were Next's defaults anyway. For non-default viewport values, export a
  `viewport` object rather than writing the tag.

### Still open

- **Mobile CTA sits 162px below an 844px fold** — the carried-over decision
  (HANDOFF §6 item 11).
- **H1 wraps to 3 lines at ≥1536px.** `2xl:text-7xl` (72px) needs ~830px for
  line 1, and the column is `max-w-3xl 2xl:max-w-[48rem]` — but **48rem *is*
  768px**, exactly `max-w-3xl`, so that override is a no-op. Line 1 breaks as
  "The problem isn't / ideas.", splitting one idea. One-token fix:
  `2xl:max-w-[53rem]`. Measured at 1920 and 2560.

---

## 4a. Order of work

Per HANDOFF §4a. The order is not arbitrary — item 1 front-loads the only
genuinely order-dependent risk in the whole port.

1. ~~**Scaffold + §5 checklist.**~~ Done.
2. ~~**Nav + hero**, then measure against FCP 364ms.~~ Done — 168ms, see §4b. Under Next the hero stops
   being an importmap + CDN `three` and becomes an npm dependency inside a
   dynamically-imported client component, with `logo-points.json` served from
   `public/`. It renders only while on screen (IntersectionObserver) and caps
   DPR at 2 — keep both.
3. ~~**Rebuild the Playwright harness against `next dev`.**~~ Done —
   `npm run verify` (5 viewports, theme round-trip, menu + Escape + focus
   return, nav morph) and `npm run perf`. The deferred a11y / zoom / dark
   passes still need adding to it. The current one points
   at a static file server and does not survive the move. It measures the CTA
   against the mobile fold, H1 line count against column width, font loading,
   theme state and console errors — every hero regression of 2026-09-05/06 was
   caught by it, none by eye. All deferred verification lands here.
4. **Sections 02–08**, mechanically.
5. **The contact form** (§10.1). `prototype2-new/` has a usable structure with
   `err-email`/`err-name` already in it — take the pattern, not the CSS.
6. **Content-blocked sections last** — Work, About, Why all wait on HANDOFF §7.

**Do not mine prototypes 1–2 wholesale.** They are 788–957 lines of hand-written
CSS each with zero Tailwind; moving a component across is a rewrite plus a token
retrofit. Only the contact form and the Why page's copy are worth taking.
HANDOFF §4a has the measurements.

---

## 5. Port checklist (run at scaffold)

- [ ] Pin **Tailwind v4** — verify `slate-500` resolves to `#62748e`.
- [ ] Replace the browser CDN `<script>` with a real Tailwind build.
- [ ] Merge `theme.css` + the inline `@theme inline` block into one
      `app/globals.css` (they are split in the prototype only because the
      Tailwind *browser* CDN cannot resolve a relative `@import`).
- [ ] Swap Google Fonts `<link>` → `next/font` (identical rendering, removes the
      current first-paint layout shift).
- [ ] Port `script.js` → hooks, with cleanups.
- [ ] Re-verify HANDOFF §5 gotchas. §5.3 (innerHTML icon swap) is already
      designed out — P3 toggles two SVGs by class, so nothing detaches, and the
      React version inherits that.
- [ ] Re-run the Playwright suite against the Next.js build.
- [ ] **Content gates (HANDOFF §7) are still open** — 14 `data-placeholder`
      elements remain, including three P0 case studies and two P0 legal pages.

### 5a. Deferred verification — schedule into step 4a.3, do not drop

Responsive, a11y, 400% zoom/reflow, the dark audit of 02–08 and the adversarial
review are deferred to the app **on purpose**: markup and class strings port
unchanged, so they are the same one-place fix either side, and the port
*centralises* repeated markup, so a systemic issue appearing eight times in
`index.html` is usually one component fix here. Auditing the prototype first
buys nothing.

Three a11y items exist **only** after the port and must be added to the suite:

- [ ] **Focus on route change** — Next's client-side nav does not move focus to
      the new page. Lands as soon as `about` / `career` become routes.
- [ ] **`useEffect` cleanup** — without it, hot reload stacks scroll and
      IntersectionObserver listeners (§4). Impossible in the static prototype.
- [ ] **Hydration vs. the theme class** — the inline no-flash script sets
      `.dark` on `<html>` before React hydrates; classic mismatch source.
