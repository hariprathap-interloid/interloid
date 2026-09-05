# Prototype 3 — Build Brief

**Status:** v1 built and verified · **Folder:** `prototype3/`
**Direction (2026-09-05):** built directly against `DESIGN-SYSTEM.md` — the
conversedatasolutions.com visual language — in **Tailwind v4**, rather than by
mixing elements from prototypes 1–2. That earlier mix-and-match plan is
superseded; `ELEMENT-CATALOGUE.md` is kept for reference only.

**Stack:** Tailwind v4 via browser CDN now, Next.js + Tailwind v4 after signoff.
See `TAILWIND-MAP.md`.

**Scope note:** this is Interloid's site *in Converse's visual language*, not a
copy of Converse's site. No Converse copy, structure-specific content, or
branding is reproduced.

---

## 1. Files

| File | What |
| --- | --- |
| `theme.css` | **The colour system. The only file to edit when re-theming.** Ships both `:root` (light) and `.dark`. |
| `index.html` | Markup + the `@theme inline` mapping + non-utility CSS |
| `script.js` | Content arrays + behaviour (nav, theme toggle, selector, reveals, spotlight) |
| `hero-logo.js` + `logo-points.json` | The hero's WebGL mark. Observes the `.dark` class; never sets it. |
| `hero-copy-lab.html` | The four hero copy/layout treatments A–D. C shipped; the rest are kept as the record of what was rejected and why. |

No build step, but **it must be served over http** — Live Server is fine.
Opening `index.html` from the filesystem leaves it unstyled.

---

## 2. Section ledger

`State` = ☐ todo / ◐ built / ☑ approved (frozen).
**Frozen sections are not to be touched** unless an instruction names them.

| # | Section | DS ref | Notes | State |
| --- | --- | --- | --- | --- |
| 00 | Morphing nav | §6.1–6.5 | max-w-7xl→6xl, transparent→glass, 0→rounded-full, 300ms. Pill-in-pill links. | ◐ |
| 01 | Hero | — | **Treatment C layout + contrast headline.** Left copy over the WebGL mark, proof as a label→value rail. Orbs/dot-grid/gradient-clip headline all removed. Deliberately ignores DS §7.2. | ☑ |
| 02 | Services | §8.4 / §8.6 | 5/7 split: selector rows + L4 feature panel. ARIA tablist, roving tabindex | ◐ |
| 03 | Stack marquee | §8.10 | Tripled list, edge fades, 28s linear. Uses `text-faint`, not `text-border`. | ◐ |
| 04 | Advantage bento | §8.2 / §14.3 | Glass tiles on slate-50, cursor spotlight | ◐ |
| 05 | Process | §8.9 | Self-drawing connector, 80px nodes, ghost numerals | ◐ |
| 06 | Selected work | §8.3 | 3 image cards — **all P0 placeholders** | ◐ |
| 07 | CTA anchor | §11.1 | Dark rounded-[3rem] slab, radial wash, 24 particles | ◐ |
| 08 | Footer | §11.2 | slate-950, 4 columns, only links that resolve | ◐ |

Not yet built: a Why page, and the §10.1 conversational form (the CTA currently
uses a mailto, not a form).

---

## 2b. Colour system (round 3)

Probed from the live **interloid.com**, not invented:
`#1f5da0` Interloid blue (28 text / 4 bg / 3 border uses) · `#289dbe` accent
(24 uses) · `linear-gradient(135deg, ...)` between them in 11+ places.

Fixing "too white": the page is a faintly blue-tinted near-white
(`--background` #f7f9fc) with **pure white cards** (`--card`) and a deeper
tinted band for alternating sections (`--secondary` #eef3f9). White-on-white
reads flat; white-on-tinted gives every card an edge with no border. The orbs
are the brand's own hues rather than a generic rainbow, and the primary CTA is
Interloid blue rather than near-black.

Architecture is shadcn-shaped: `theme.css` holds semantic tokens in `:root`
(oklch), `@theme inline` re-exports them as Tailwind colours. **Re-theming
touches one file; no component class changes.** Light stays the default
(DS §1.2 rule 1); as of round 8 the `.dark` block is **live and toggled from the
nav**, not merely declared. Note `--faint`: faint *display text* needs its own
token, because `--border` in dark is white at 10% alpha.

The radius scale is one knob: `--radius: 0.75rem` drives `rounded-sm` …
`rounded-4xl` via `calc()`.

## 3. Verified (Playwright, 2026-09-05 — pre-round-8 figures)

Matches the live reference exactly where it should:

| | Prototype 3 | conversedatasolutions.com |
| --- | --- | --- |
| H1 | Outfit 128px / 900 | Outfit 128px / 900 |
| Body | Inter, `slate-600` | Inter, `slate-600` |
| Hero bg | `--secondary` #eef3f9 | `slate-50` (retinted to brand) |
| Nav rest → scrolled | 1280 → 1152px, glass, rounded-full | 1280 → 1152px, glass, rounded-full |
| Page height | 6131px (6167px after the round-8 hero) | 6151px |

Also passing: zero console errors · one `h1` · **no heading-level skips** · no
dead anchors · both fonts loading · all 26 reveals fire · the rail draws · tab
click + arrow keys switch the panel · mobile menu opens on a dead-centre tap
(HANDOFF §5.3) · 24 particles are seeded, so screenshot diffs stay meaningful.

---

## 3b. Parked variants

| File | What | Why parked |
| --- | --- | --- |
| `hero-signal.html` | The dark "Signal" hero — ink-deep ground, 4-layer aurora, grain, accent glow CTA. Standalone and runnable. | Approved on look. Reverted from `index.html` because the page below is light-first (DS §1.2 rule 1) and the CTA slab + footer already close dark — opening dark costs that ending its impact. Kept for **dark mode** (`theme.css` already ships a working `.dark` block) or a dark campaign/landing page. |
| `hero-lab.html` | Three hero treatments side by side — A Cadence (light, centred, horizontal engagement rail), B Engagement (split, tilting timeline card), C Signal (dark). Includes the running engagement timeline. | Comparison artifact. Whichever direction wins gets lifted into `index.html` as one section. |

`hero-signal.html` carries its own re-enable instructions in the file header,
including the nav inversion it needs (at rest the bar is transparent over ink,
so the dark wordmark and toggle would be invisible).

## 4. Round log

| Round | Instruction | Touched | Outcome |
| --- | --- | --- | --- |
| 1 | Header from D's V1 · DS layout + auto-hide on scroll | 00 | Superseded by round 2 |
| 2 | Investigate conversedatasolutions.com; rebuild in Tailwind | all | ◐ built + verified |
| 3 | Too white — probe interloid.com, build a token-based brand theme | all | ◐ built + verified |
| 4 | Copy/tone audit of nav, header and buttons; CTA label system | 00, 01, 07 | ◐ 3 labels down from 5; nav to `xl:` breakpoint |
| 5 | Hero: fix the split headline, add life | 01 | ◐ H1 restructured, orb parallax, chips, dot grid, shine, cue |
| 6 | Explore "make it alive": 3 treatments + engagement timeline | — | ◐ `hero-lab.html`; dark tried on index then reverted, parked |
| 7 | Hero animation: particles condense into the mark | 01 | ☑ `hero-logo.html` approved. No rotation, no glow, no cursor modes |
| 8 | Hero content + design; fold into `index.html` | 01, 00 | ☑ 4 treatments in `hero-copy-lab.html`; **C "Terms"** chosen and folded in. Theme toggle now ships. |
| 8b | Hero copy pass 2 | 01 | ☑ Headline → the contrast line; subhead names the audience; "See the proof"; Proposal row dropped |
| 8c | Hero copy pass 3 | 01 | ☑ DS §7.2 badge replaces the mono eyebrow and carries the audience; lead cut to two sentences; **terms rail removed** |

---

## 4b. Round 8 detail — the hero that shipped

**What shipped is C's layout with A's headline.** Round 8 chose treatment C
whole; round 8b kept its structure — left copy over the mark, proof as an
editorial label→value rail rather than a chip row — and swapped the headline
back to the contrast line, which carries more:

> `● For founders & business leaders`
> **The problem isn't ideas. / It's shipping.**
> Defined problems in, deployed software out. Interloid is a senior engineering
> team working in your accounts and on your repos.
> `Book a free 30-min consult` · `See the proof`

Round 8's note said the hero could not say *who it is for* without inventing
client data. **8b/8c resolve that a different way:** the hero names the
audience — "founders & business leaders". That is a *positioning* claim about
who we sell to, not a *proof* claim about who we have served, so it needs no
source, and it is what review §9.2 was asking for.

**The split, and why it must stay split:** the **badge carries the audience**,
the **lead carries the offer**. The full mockup string, "Senior product
engineering · for founders and business leaders", wrapped to a two-line pill at
390px — the dot then floats mid-left and it reads as broken — and it duplicated
"senior engineering team" in the lead directly beneath it. One clause each.

The geography line ("India-based · US & UK overlap hours") left the hero with
the old eyebrow. It is still in the footer. That was the hero's last §7 P1 flag,
so the hero now has **zero** `data-placeholder` elements (page total 15 → 14).

**The hero no longer states any engagement terms.** 8b dropped the Proposal
row; 8c removed the whole Cadence / Ownership / Exit rail, and the lead does
not repeat the weekly demo. Every one of those claims still stands on the CTA
slab (§07), Process (§05) and Why Interloid (§04) — nothing was lost from the
page — but the hero itself no longer carries proof, which is a deliberate
reversal of what round 8 chose treatment C for. Worth re-reading alongside the
review's core finding before launch.

**`See the proof` points at §06 Selected Work, which is three placeholder
cards.** That makes HANDOFF §7's case-study P0 into a hero-level promise: the
hero now explicitly offers proof the page cannot yet show. Either land the case
studies before launch or repoint that link — it is one `href`.

The treatments not taken are still in `hero-copy-lab.html` as the record:
A *Contrast* (whose headline was taken, but with the old chip-row proof),
B *Ledger* ("Live in production. / Not in a backlog." with a three-column
evidence strip), C as originally written, D *Plain*.

**Theme.** The toggle ships. `.dark` on `<html>` is the one convention across the
page and both labs; light stays the default. An inline head script resolves it
before first paint so a stored dark preference does not flash. `script.js` owns
the class; `hero-logo.js` *observes* it via MutationObserver and only re-tunes
blending — the two can never fight over who set the theme.

**Found and fixed on the way:**

- **The mobile fold is the binding constraint on hero copy.** 8b's 42-word lead
  pushed both CTAs off a 390×844 screen; 8c's 20-word lead and the removed rail
  bought it back, so the DS-specified `text-xl` lead was restored at every width
  (8b had stepped it down to `text-lg` below `sm:`). The verification script
  measures the primary CTA's bottom edge against the viewport — 771 of 844 at
  the time of writing. Re-run it whenever hero copy grows.
- **Mobile was broken, twice.** First: the mark spanned ~60% of the viewport
  and ran through the H1, and the scrim ran horizontally where the layout
  stacks vertically. Then, once 8b's longer subhead landed, the mark came back
  cropped edge to edge — because on mobile the *section* is taller than the
  viewport, so `camera.aspect` is computed against the section and FRAME.w
  collapses. The mark is now capped on frame **width** (the logo is square in
  unit space, x ±1 / y ±0.98) and centred at 58% of the section's own
  `padding-top`, read from the DOM so the CSS band and the mark cannot drift
  apart. The scrim runs downward in two layers — the first caps the top 13%, or
  the cloud runs through the transparent nav — and the copy clears 36vh, down
  from 40 because at 40 both CTAs fell below the fold.
- **`text-border` is not a text colour.** The marquee and the inactive selector
  arrows used it; in dark `--border` is white at 10% alpha and they vanished.
  New `--faint` token, same value in light, opaque in dark.
- `hero-logo.js`'s `#state` readout is guarded — it is lab-only chrome.

**Dark mode is verified for the hero only.** Sections 02–08 were spot-checked
section-by-section and hold up because they are token-based, but that is not an
audit — see HANDOFF §6.

---

## 5. Inherited constraints (from HANDOFF.md — do not relitigate)

- Self-contained, no build step. Outfit + Inter. Inline Lucide SVG, no emoji.
- Placeholder toggle present; all unproven claims `data-placeholder` (8 remain).
- `prefers-reduced-motion` fully honoured.
- Only these numeric claims may be stated as fact: free 30-min consult ·
  48-hr written proposal · weekly working demo · 30 days post-launch support ·
  30-day notice · 100% code/IP ownership.
- Re-read HANDOFF §5 gotchas before touching CSS/JS.
- **HANDOFF §7 content gates are open and block launch** — three real case
  studies and the privacy/terms pages are P0.
