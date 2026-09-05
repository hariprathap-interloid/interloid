# Interloid — Prototype 2

A **clean-slate design exploration** of the Interloid portfolio: same
[DESIGN-SYSTEM.md](../DESIGN-SYSTEM.md) language, entirely new architecture.
Built against the strategy in [INTERLOID-WEBSITE-REVIEW.md](../INTERLOID-WEBSITE-REVIEW.md);
Prototype 1's layout decisions were deliberately not referenced.

**Run it:** open `index.html` in a browser. Self-contained — no build, no dependencies.
`why-choose-us.html` is linked from the nav ("Why us") and from Act 4.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Homepage — the four-act narrative |
| `why-choose-us.html` | Why page — "The Working Agreement" |
| `styles.css` | Shared stylesheet, DS tokens verbatim |
| `script.js` | Shared behaviour, null-guarded per component |

## The homepage: a four-act narrative

The brief's core sentence — *"we understand your problems, we know how to solve
them, we can prove delivery, and working with us is straightforward"* — **is**
the page structure:

| Act | Section | Composition |
| --- | --- | --- |
| — | Hero | Left-aligned 7/5 split; copy + the **engagement receipt** (an itemised, timestamped proof object) over a line-grid |
| — | Facts strip | Three verifiable facts, hairline band |
| 1 | `#problems` — "Sound familiar?" | **Sticky left column** + scrolling problem→answer pairs, in the client's voice |
| 2 | `#solutions` | **Numbered editorial index rows** — 6 services condensed into 4 outcome-defined areas |
| — | `#stack` | **Proven-technology showcase** — 5 ruled columns, each stating "the bet" behind the choice (not logo soup) |
| 3 | `#work` | **One featured case told as a story** (problem → built → why it stuck + stat column) + compact case rows + pull-quote |
| 4 | `#process` | **Schedule ledger** — Day 1 / Hour 48 / Every week / At handover |
| — | `#contact` | Dark slab with the **3-field micro-form embedded** + booking/email alternatives |
| — | Footer | Slim 3-column band |

## The Why page

Differentiators are recast as **"The Working Agreement"** — five plain-language
contract clauses (Ownership, People, Price, Visibility, Exit), each with its
commitment figure, rendered as a document with mono clause numbers. Followed by
**"A normal week, working with us"** (a five-day band making direct
communication concrete), a pull-quote, and **"Straight answers"** — a static,
no-accordion Q&A grid answering location, people, embedding, and cost.

## How this differs from Prototype 1

Independently verified by a dedicated divergence reviewer: *"genuinely diverges
in every load-bearing section — no structural-copy findings."*

| Dimension | Prototype 1 | Prototype 2 |
| --- | --- | --- |
| Narrative | Services-led | Problem → answer → proof → ease |
| Hero | Centred, full-viewport | Left split + receipt object |
| Nav | Floating glass pill | Slim hairline bar, underline links |
| Services | Selector list + panel | Numbered index rows |
| Proof | 3-up image cards | Story case + case rows |
| Process | Node timeline | Schedule ledger |
| Contact | Long form section | Micro-form in the dark slab |
| Why page | Comparison table + accordion | Agreement clauses + week band + open Q&A |
| Texture | Dot grid, glass bento | Line grid, hairline rules, mono accents |

Retained (DS-mandated primitives, not P1 decisions): rounded-full buttons,
ambient orbs, two-tone headlines, reveal motion, dark slab, slate-950 footer,
detached mobile-menu card, Outfit + Inter.

## The version switcher (bottom-left)

Both pages carry a **Base / V1** control so the two layout directions can be
compared live; the choice persists across pages and reloads (localStorage).

| | Base | V1 · DS layout |
| --- | --- | --- |
| Hero | Left-aligned 7/5 split + engagement receipt, **100dvh** | DS §7.2 centred archetype, **100dvh**, slate-50, animated gradient H1, badge + trust chips |
| Nav | Slim hairline bar, underline links | DS §6.1 **floating pill morph** (width + surface + radius) |
| Facts strip | Shown below the hero | Hidden — its facts move into the hero trust chips |
| Everything else | shared | shared |

Both hero variants live in the DOM (`.hero--base` / `.hero--v1`); the inactive
one is `display:none`, which also removes its `h1` from the accessibility tree.
The switcher is a prototype evaluation aid — once a direction is chosen, delete
the losing hero block, the `.ver-toggle`, and the `html.v1` CSS section.

## Deliberate design-system deviations (documented, not accidental)

1. **Nav (Base version only)** — a full-width hairline bar instead of the DS
   §6.1 floating pill. The **V1 toggle restores the exact §6.1 pill morph**, so
   both readings can be compared before amending either the page or the DS.
2. **Hero (Base version only)** — left-aligned split on white with a static
   gradient. The **V1 toggle is the DS archetype**: centred, slate-50, animated
   §2.4-B gradient, trust chips, bottom fade. Both are 100dvh.
3. **Mono voice** — `--font-mono` (a DS token) used for eyebrows, numerals,
   timestamps and tags; never body copy.
4. **Gradient starts from `--brand`** (Interloid blue) rather than `--primary` —
   same house calibration as Prototype 1.

## Content & credibility

- The only unmarked numbers are the contractual set: free 30-min call,
  48-hr proposal, weekly demo, 30 days support, 30-day notice, 100% ownership.
- Everything invented is flagged `data-placeholder` — press **"Show
  placeholders"** (bottom-right) to see all of it: the featured case + case
  rows + both quotes, the AWS Partner claim, the positioning line, the
  1-business-day reply promise, the "clauses are in the contract" assertion
  (⚠ verify against the real contract — the Why page's premise depends on it),
  and Privacy/Terms.
- Geography and entity are consistent: India-based, US & UK overlap hours,
  Interloid Technologies Private Limited.
- Not shown anywhere (title/meta are invisible to the toggle): the
  "— Prototype 2" title suffix and prototype meta description must be replaced
  before launch.

## Verified (adversarial, 5-agent review + fixes)

Five independent reviewers (design-system, **divergence**, credibility,
a11y/code, runtime QA) produced ~30 findings; all critical/major fixed:

- `position: sticky` was silently defeated by `.section{overflow:hidden}`
  (a scroll container) — fixed with `overflow: clip`; verified pinned at 128px.
- Global focus ring was cascade-defeated on primary/glow buttons — explicit
  `:focus-visible` rules re-append it; verified via keyboard Tab.
- Form: `aria-describedby` error association, focus moved to the success panel.
- Contrast: footer column headings and dark-form placeholders raised to pass AA;
  input boundaries raised for 1.4.11; `::selection` fixed.
- Credibility: "DAY 90" (an engagement-length claim) removed; "guaranteed"
  softened; the proof-section frame and contract-clause claim flagged;
  P1-verbatim sentences rewritten fresh.
- Plus: reveal threshold fix for 400%-zoom reflow, sticky max-height guard,
  menu behaviour across the 1024px boundary, concise link names on index rows.

Post-fix, both pages pass: zero console errors, zero overflow at
1440/1280/1024/768/390/360, heading order clean, reduced-motion fully inert,
keyboard walk with visible focus everywhere, mobile menu center-click/Escape/
focus-return correct.

## Known gaps (deliberate)

1. All proof is placeholder — the content workstream (review §9.4-P0) gates it.
2. **No team/About surface** on either page — "who will I work with?" still
   needs real people; don't invent them.
3. No pricing ranges — a business decision; Q4 on the Why page holds the spot.
4. The booking link is `href="#"` pending a Cal.com/Calendly account.
5. Shadow alphas run slightly heavier than DS §15.2 — same house calibration
   as Prototype 1; reconcile the doc or both stylesheets together.
