# Interloid — Design System Prototype

An interactive refactor of the Interloid homepage built on
[DESIGN-SYSTEM.md](../DESIGN-SYSTEM.md), structured to fix the problems found in
[INTERLOID-WEBSITE-REVIEW.md](../INTERLOID-WEBSITE-REVIEW.md).

**This is a decision aid, not a deliverable.** The point is to let you judge the
visual direction and the working method before committing to a full rebuild.

## Run it

```bash
# just open it — no build step, no dependencies
start prototype/index.html          # Windows
```

Or serve it (needed only if you want to test on a phone on the same network):

```bash
npx serve prototype
```

## Files

| File | Lines | What it holds |
| --- | --- | --- |
| `index.html` | ~500 | Semantic structure only. No inline content lists. |
| `styles.css` | ~870 | The whole design system as CSS custom properties. |
| `script.js` | ~430 | A `DATA` object + the interaction layer. |

### The important architectural choice

**All copy lives in the `DATA` object at the top of `script.js`.** Sections render
from it. That means the content workstream and the design workstream can run in
parallel — when real case studies and testimonials arrive, you edit one object
and nothing in the markup or CSS changes.

```js
const DATA = {
  clients:  [...],   // ← swap for real logos
  services: [...],
  cases:    [...],   // ← the critical gap (review §9.4-P0)
  process:  [...],
  why:      [...],
  quotes:   [...],   // ← needs real testimonials
  faq:      [...],
};
```

## The "Show placeholders" button

Bottom-right of the page. Toggling it outlines every element that is currently
invented content, with a label saying what it needs. There are **9** of them.
Use it to see exactly how much of this page is still waiting on real material.

## What changed vs. the live site

| Live site | Prototype | Review ref |
| --- | --- | --- |
| No web font (`-apple-system`) | Outfit + Inter | §6.2 |
| Buttons `border-radius: 10px` | `rounded-full`, `h-14`, `active:scale-95` | §12.3 |
| Cards 8–22px radius | 24–40px | §15.1 |
| Emoji icons (💻📱⚙️) | Inline Lucide SVG | §6.4 |
| Static sticky nav | Morphing transparent → glass pill | §6.1 |
| Accent `#289DBE` at 3.15:1 | `--accent-text: #1b7c99` at 4.57:1 | §6.3 |
| 20 dead footer links | Only links that resolve | §7.1 |
| No proof anywhere | Logo strip + case studies + testimonials | §5.1 |
| Technologies = 1,422px section | Demoted to a marquee band | §5.7 |
| Process buried on orphan page | Promoted to the homepage | §4.2 |
| Two CTAs stacked at the end | One dark slab + booking path | §8.2 |
| 6 identical service cards | Split showcase w/ one dominant panel | §6.1 |
| No FAQ | 6 objection-handling questions | §9.4 |
| Form: 7 fields, cold | 4 fields + alternative contact rail | §8.2 |

## Verified

Run against the prototype with Playwright:

```
console errors ........... none
h1 count ................. 1
heading-level skips ...... 0
images without alt ....... 0
inputs without label ..... 0
buttons without name ..... 0
emoji in content ......... false
body text contrast ....... 4.76:1  (AA pass)
accent text contrast ..... 4.57:1  (AA pass — was 3.15:1)
reduced-motion ........... 0 animating, 0 hidden reveals
horizontal overflow ...... none at 1440 / 1280 / 768 / 390 / 360
```

Interactions tested: nav morph · service panel swap · FAQ accordion ·
form validation (blocks empty, accepts valid) · scroll reveals · mobile menu.

## Implemented from the design system

- §2.5 ambient blurred orbs · §2.6 masked dot-grid
- §2.4 two-tone gradient headlines (incl. the animated hero variant)
- §5.2-C split showcase · §5.2-D bento grid
- §6.1 morphing nav · §6.5 detached mobile card menu
- §8.2 glass tiles with cursor spotlight (alpha 0.05)
- §8.4 feature panel with blur-swap transition
- §8.9 process timeline with self-drawing rail + ghost numerals
- §8.10 infinite marquee, pauses on hover
- §9 full button system · §11.1 dark CTA slab with drifting particles
- §12.4 mobile snap carousel (`85vw` peek)
- §13.1 `IntersectionObserver` reveals, `once: true`, index-staggered
- §18.5 `prefers-reduced-motion` fully honoured

## Known gaps (deliberate)

1. Content is placeholder — that's the point of the toggle.
2. Homepage only. Service detail, `/work`, `/about`, `/pricing` not built.
3. Privacy/Terms are `href="#"` — flagged, because they must exist before launch.
4. Plain CSS, not Tailwind. Token names map 1:1 to the `@theme` block in
   DESIGN-SYSTEM.md §19.1, so porting is a find-and-replace, not a rewrite.
5. Client logos are text, not images.
6. Mobile is ~15,200px tall vs the live site's ~8,800px — because there is
   genuinely more content (proof, testimonials, FAQ). Worth revisiting whether
   every section earns its length once real copy lands.

## If you keep this direction

Next decisions, roughly in order:

1. Port to Tailwind v4 + the existing Next.js app, or keep plain CSS?
2. Confirm the accent. `#289DBE` is Interloid's, but it is light — the darkened
   `#1b7c99` is doing the work for text. A slightly deeper brand cyan would let
   one value serve both.
3. Decide what case studies you can actually publish (NDA constraints) — this
   gates the `/work` section entirely.
4. Confirm the geography line. The prototype says *"India-based · US & UK hours"*,
   which contradicts the live meta description's *"Based in US & UK"*.
