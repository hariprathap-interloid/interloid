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
| `hero-type-lab.html` | Display face (Outfit / Geist / Satoshi) × line-2 highlight (solid / static gradient / animated). **Resolved: Satoshi + solid.** Kept as the record. |

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
| 9 | Display face + line-2 treatment | all | ☑ `hero-type-lab.html`; **Outfit → Satoshi**, line 2 stays solid |
| 9b | Lead rewritten to carry the risk reversal | 01 | ☑ Three sentences; mobile rebalanced around it |
| 10 | Lead refactored: drop the aggressive and the negative, lead on speed | 01 | ☑ Two sentences; agentic AI named as mechanism, not identity |
| 11 | Full 60-word lead, split as deck + body | 01 | ◐ Desktop good; **mobile CTA 162px below the fold** — open decision |
| 12 | Nav legibility over the mark; viewport sweep | 01 | ☑ Scrim top cap; bottom-fade z-order bug; cue collision; H1 scales with its column |

---

## 4b. Round 8 detail — the hero that shipped

**What shipped is C's layout with A's headline.** Round 8 chose treatment C
whole; round 8b kept its structure — left copy over the mark, proof as an
editorial label→value rail rather than a chip row — and swapped the headline
back to the contrast line, which carries more:

> `● For founders & business leaders`
> **The problem isn't ideas. / It's shipping.**
> **Defined problems in. Deployed software out.**
> Interloid combines senior engineering expertise with modern AI and agentic
> workflows to accelerate every stage of development. We build, test, and ship
> continuously, delivering working software every week as a demo and maintaining
> clarity throughout the process. Bugs, product changes, and potential issues are
> surfaced and addressed as they arise — not discovered at the end of a sprint
> or review cycle.
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

## 4c. Round 9 — display face and the persuading lead

**Satoshi replaces Outfit** (Fontshare), chosen in `hero-type-lab.html` against
Outfit and Geist. Geist was rejected on a specific ground: it reads as a heavier
**Inter**, which is the body face, so it collapses the display/body contrast the
page currently gets for free. Satoshi keeps Outfit's warmth with far less
ubiquity — Outfit is the default startup display face and was signalling energy
where the pitch is judgment.

Two consequences that are easy to trip over:

- **Satoshi has no 600.** It ships 300/400/500/700/900. The page asks for
  `font-semibold` on the display face in 8 places, all mobile-menu links; CSS
  font matching resolves those up to 700 and it is invisible at that size. Do
  not invent a 600.
- **Satoshi is wider than Outfit.** At `lg:text-7xl` the H1's line 1 overflowed
  the `max-w-3xl` column and wrapped as "The problem isn't / ideas.", splitting
  one idea and orphaning the noun. The H1 is now 64px at `lg`. The two-tone
  silhouette — one long neutral line over one short accent line — is the shape
  the whole page uses, so the size gave way, not the shape.
- **A second font origin** is now on the critical path (`api.fontshare.com` +
  `cdn.fontshare.com`, both preconnected). That is a DNS+TLS handshake against
  a 364ms FCP budget (HANDOFF §8). Self-host both faces in the Next.js port.

**Line 2 stays solid.** The lab measured a real collision and it is *unfixed*:
the solid headline colour and the primary CTA background return the identical
computed value, in **both** themes (light `--brand` == `--primary`; dark both
resolve to `--accent`). The static gradient was the fix for it and was not
taken, so the two heaviest coloured objects in the hero remain the same colour.
Deliberate, not overlooked. Note `--accent` is not an escape hatch here: at
display size on `--secondary` it measures **2.83:1**, under the 3:1 large-text
floor.

**The lead now carries the risk reversal.** Three sentences, against DS §7.2's
"one or two" — deliberate, because 8c removed the terms rail and this paragraph
is the only thing left in the hero that answers "why should I trust you". What
answers that for a founder is risk reversal, not adjectives: sentence 1 the
outcome, 2 how it stays visible while it happens, 3 what happens if it goes
wrong. Every claim is on HANDOFF §7's allowed list.

That cost mobile room, and the band paid for it: `padding-top` went 40vh → 36vh
→ **28vh** across three copy passes, and `hero-logo.js` now caps the mark's
SCALE against the band as well as the frame — otherwise the mark keeps its size
as the band shrinks and slides up behind the nav.

---

## 4d. Round 10 — what the lead stopped saying, and why

Two of round 9's clauses were cut on the user's read, and both reads were right:

- **"inside your accounts and on your repos" was aggressive.** It framed the
  arrangement as us getting into their infrastructure rather than them keeping
  control. Process (§05) already says "in your repos and your accounts from
  commit one", where the same fact reads as reassurance rather than a boast.
- **"either side can leave on 30 days' notice" was negative.** It plants a
  failure scenario in the first five seconds. Risk reversal converts late, not
  in the opening line; it stands on the CTA slab (§07) and in Why Interloid.

What replaced them is speed, with a mechanism named: *agentic AI in the loop*.

**The word order is the whole decision, and it must not drift.** "Senior
engineers with agentic AI in the loop" — never "AI-driven team", never
"AI-first". The site is sold end to end on seniority; to this buyer an AI-led
hero reads *cheap, automated, junior-equivalent*, which is precisely the fear
the rest of the page exists to answer. The AI has to read as leverage FOR senior
people. Positioned that way it adds speed without spending the trust.

Two standing cautions:

1. **This is only shippable if it is how Interloid actually works.** It is a
   method claim, not a numeric one, so HANDOFF §7 does not demand a source —
   but §7's whole point is not asserting what you cannot defend in a sales call.
2. **"AI" now appears in two senses on the page** — how we build (hero) and
   what we sell (§02 "AI integration"). Keep them distinct; muddling them makes
   both weaker.

Note "a working demo every week" is the §7 allowed phrasing. "Ships weekly"
would claim production releases and is not on the list.

At 32 words the lead is back inside DS §7.2's "one or two sentences", and the
mark's mobile band went 28vh → 36vh with the room that freed.

---

## 4e. Round 11 — the deck, and an open mobile decision

The lead is now 60 words, so it is **two elements, not one paragraph**: a bold
**deck** carrying the thesis, and a body paragraph carrying the detail. A single
60-word block is a wall with no entry point. The deck also keeps DS §3.2's "lead
is text-xl" satisfied, with the supporting copy one step down at text-lg.

The deck is set in **Inter, not the display face** — Satoshi has no 600, so
`font-semibold` there resolves to 700 and fights the 900 H1 immediately above.

Two edits to the supplied copy, both mechanical: `-` → em dash for consistency
with the rest of the page, and "as demo" → "as a demo". Note that "as a demo"
is load-bearing, not filler — "delivering working software every week" on its
own claims weekly *production releases*, which is not on HANDOFF §7's list.
"Weekly working demo" is.

### The open decision: mobile

Desktop is comfortable (CTA bottom 765 of 900). **Mobile is not: the CTA now
finishes 162px below an 844px fold**, and this one cannot be shaved out of the
margins the way rounds 9 and 10 were. The arithmetic:

| | px |
| --- | --- |
| CTA bottom at 390×844 | 1006 |
| Overshoot | **162** |
| Mark's band today | 304 (36vh) |
| Band that would clear the fold | 142 (16.8vh) |
| Band floor before the mark collides with the nav | **271 (32.2vh)** |

So clearing the fold does not just mean a smaller band — it means going *below*
the point where the mark runs into the transparent nav, so the mark would have
to shrink by roughly half and its centring ratios be re-tuned as well.

Three ways out, none of them free — **user's call, nothing chosen yet**:

1. **Accept it.** Mark, H1 and deck are all above the fold, and the deck is the
   whole pitch in six words. One scroll reaches the CTA. Costs some mobile
   conversion; costs nothing else.
2. **Halve the mark on mobile** and re-tune the ratios so everything fits above
   the fold. Keeps every word and the CTA; spends the brand moment that took
   two sessions to build.
3. **Show sentences 1–2 on mobile, all three at `sm:` and up.** Keeps the mark
   and the fold; costs content parity between mobile and desktop.

---

## 4f. Round 12 — the viewport sweep

Started from one report — the cloud showing through the nav's right-hand
controls — and a sweep at 1280/1440/1920/2560 turned up three more.

1. **The nav had no ground on the right.** The desktop scrim is a single 90deg
   ramp that protects the LEFT, where the copy is; the nav is full-width and
   transparent at rest, so the theme toggle and "Let's talk" sat over the
   densest part of the cloud. `.scrim` is now two layers — a 180deg **top cap**
   (solid through 78px, spent by 170px, stops in **px** because what must be
   covered is the nav's fixed height, not a fraction of the section) over the
   existing 90deg ramp. The mark's own top edge is ~144px, so it is grazed, not
   clipped.
2. **The bottom fade was painting over the CTAs.** It carried `z-10` — the same
   level as the copy — and sat later in the DOM, so it won. Invisible at 900px
   tall, but at **1280×720** it washed out both buttons completely. Now `z-[2]`:
   above the scrim, below the copy.
3. **The scroll cue collided with the CTA row** on short viewports. Hidden
   under `max-height: 780px`; it is an affordance, not content.
4. **The H1 was 72px in a 768px column at ≥1536px**, wrapping as "The problem
   isn't / ideas." — the same mid-idea break round 9 fixed, reintroduced when
   the size step moved to `2xl:text-7xl`. The size is kept; the **column now
   scales with it** (`2xl:max-w-[53rem]`), because 72px needs ~830px for line 1.
   Measured 2 lines at 1280 / 1440 / 1920 / 2560.

**The H1 size and its column are one unit.** Change either and line 1 wraps
mid-idea; `.short-vp.mjs` reports font size, column width and line count at
four widths.

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
