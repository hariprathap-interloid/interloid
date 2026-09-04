# Why Choose Us — Page Prototype

The missing `/why-choose-us` page, rebuilt on [DESIGN-SYSTEM.md](../DESIGN-SYSTEM.md)
and the credibility rules from [INTERLOID-WEBSITE-REVIEW.md](../INTERLOID-WEBSITE-REVIEW.md).
A sibling of the homepage prototype in `../prototype/` — same tokens, nav, footer,
buttons and motion; new editorial compositions.

**Run it:** open `index.html` in a browser. No build step, no dependencies.
Nav/CTA links point to `../prototype/index.html`, so keep the two folders side by side.

## Page structure

| # | Section | Composition | Answers |
| --- | --- | --- | --- |
| 1 | Hero (inner-page, compact) | Centred, two pulsing orbs | "Not a bigger agency. A better one." |
| 2 | **The Ledger** `#difference` | Semantic `<table>`: typical agency vs. Interloid, 5 rows | What actually survives into the contract |
| 3 | Commitments band `#commitments` | 4 display figures + trust line | The numbers we sign (48 hrs · Weekly · 30 days · 100%) |
| 4 | Principles `#principles` | Editorial numbered rows, ghost numerals | Four structural decisions |
| 5 | Process `#process` | §8.9 timeline (shared with homepage) | What an engagement looks like |
| 6 | Pull quote | Single centred voice | Social proof (placeholder) |
| 7 | Questions `#questions` | Numbered accordion | "Ask any vendor these — including us" |
| 8 | Dark CTA slab | §11.1 | "Ask us the hard questions." |
| 9 | Footer | Same as homepage; real links only | — |

**Deliberately not a card catalogue.** Every section is a different composition —
ledger table, stat band, editorial rows, timeline, quote, accordion. The one
repeated component (process timeline) is intentional cross-page consistency.

## Content & credibility decisions

- **The only numbers on the page are contractual process commitments**
  (48-hr proposal, weekly demo, 30-day support, 100% ownership, free 30-min
  consult) — and the commitments band says so explicitly, turning the review's
  credibility critique into a trust device.
- No SOC 2 / HIPAA claims, no "10+ years combined", no invented percentages.
- Geography: "India-based, US & UK overlap hours" (the honest framing chosen in
  the review, pending your confirmation).
- The "typical agency" column criticises a generic model, names no one, and stays
  within ordinary competitive positioning.
- Placeholders are marked `data-placeholder` and visible via the
  **Show placeholders** button (bottom-right): the testimonial, the AWS Partner
  claim (needs a Partner-Finder link), and Privacy/Terms.

## Design-system notes

- Tokens are byte-identical to `../prototype/styles.css` — porting to Tailwind v4
  is the same find-and-replace as the homepage.
- Two documented deviations (commented in `style.css`): the hero surface is
  white (not §7.3's slate-50) so the ledger section below can sit on slate-50
  and its elevated column can pop; the process timeline's rail/timebox colours
  are surface-adapted for slate-50.
- The accent `#289dbe` is used only at display size / for icons; body-size accent
  text uses the AA-safe `--accent-text: #1b7c99`.

## Interactions & motion

Morphing nav (§6.1) · detached mobile menu card (§6.5) · scroll reveals
(`{opacity:0, y:20}`, 600ms, once, 100ms auto-stagger via `data-stagger`) ·
self-drawing process rail · accordion (button-in-heading, `aria-expanded`) ·
scrollspy · CTA particles · `prefers-reduced-motion` disables everything.
Content is plain HTML (no JS-rendered copy — unlike the homepage's DATA object,
this page is bespoke editorial, so static markup is the cleaner call); a
`no-js` class guard means nothing is hidden when JavaScript is off.

## Responsive behaviour

- **< 768px:** the ledger linearises — each `<tr>` becomes a card with
  CSS-generated "A typical agency" / "Interloid" labels; commitments go 2×2;
  process goes vertical with a left rail; principles stack.
- **≥ 1024px:** ledger three-column, commitments 4-up with dividers,
  principles two-column, process horizontal.
- Verified zero horizontal overflow at 1440 / 1280 / 1024 / 768 / 390 / 360.

## Verification (adversarial, multi-agent)

After my own smoke test, four independent review agents audited the page
(design-system conformance, content credibility, accessibility/code, runtime QA
with Playwright). ~30 findings; all critical/major items fixed:

- **Critical:** centre-tapping the hamburger opened and instantly re-closed the
  menu (icon `innerHTML` swap detached the click target before the outside-click
  check). Fixed with `stopPropagation` + `composedPath` — **in the homepage
  prototype too, which had the same bug.**
- **Majors fixed:** "two-week sprints" contradicting the weekly-demo commitment
  (both pages); closed mobile menu's links tabbable while invisible; accordion
  focus ring clipped by `overflow:hidden`; six slate-400 text contrast failures;
  footer-bar contrast on slate-950; centred Questions header (now left-aligned
  per §16.4, with the missing eyebrow badge added).
- **Also fixed:** absolute "you will never…" claim softened; hyperbole in the
  principles intro; testimonial reworded number-free; "Fixed quote" → "Proposal";
  entity-name consistency; Escape now refocuses the toggle; collapsed accordion
  panels removed from the accessibility tree; `aria-hidden` on 19 decorative
  SVGs; mobile menu is a labelled `<nav>`; a "see it on a real build" proof
  link added under the ledger.

Post-fix, both pages pass: centre-click menu open/close/Escape-refocus, tab
order skips the closed menu, inset accordion focus ring, all probed contrast
≥ 4.55:1, zero console errors, zero overflow, reduced-motion fully inert.

## Known gaps (deliberate)

1. Testimonial and AWS Partner link are placeholders — content workstream.
2. **Pricing guidance** is claimed ("transparent") but no ranges are published —
   that's a business decision for you; a `/pricing` page or one sentence of
   ranges would strengthen the ledger's "How you pay" row.
3. The `— Design System Prototype` title suffix and `../prototype/` link paths
   are prototype-stage only; repoint for production.
4. Shadow alphas slightly exceed the DESIGN-SYSTEM §15.2 ladder — a system-wide
   house calibration shared with the homepage prototype; amend the doc or soften
   both stylesheets together, not per-page.
5. The homepage prototype's FAQ header is still centred (same pre-existing drift
   this page just fixed); align it in a later pass.
