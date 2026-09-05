# Element Catalogue — what exists in which prototype

Reference sheet for building Prototype 3 by selection. Use the **label** +
**element name** in your instructions (e.g. "take **B/chapter-marker**").

| Label | Folder | Direction in one line |
| --- | --- | --- |
| **A** | `prototype/` | Services-led, floating-pill nav, centred hero, selector+panel showcase, bento, node timeline |
| **A2** | `why-choose-us/` | A's Why page — comparison ledger, commitments band, accordion |
| **B** | `prototype2/` | Centred chaptered editorial — command pill, chapter numerals, horizontal accordion, ladder |
| **C** | `prototype2-archive/` | Left-split hero, engagement receipt, sticky problems, index rows, schedule ledger |
| **D** | `prototype2-new/` | C + technology-stack showcase + Base/V1 hero switcher |

---

## A — `prototype/`

| Element | Class hooks | What it is |
| --- | --- | --- |
| `A/nav-pill` | `.nav__inner` | Floating rounded nav bar, three-across (mark / links / CTA) |
| `A/hero-centred` | `.hero__inner .hero__orbs` | Centred hero with 3 animated gradient orbs + bottom fade |
| `A/trust-bar` | `.trust .trust__item` | Thin band of trust items under hero |
| `A/marquee` | `.marquee__track` | Infinite logo/keyword marquee with edge fades |
| `A/selector-panel` | `.selector .panel` | Left list of services → right detail panel (tiles + chips) |
| `A/bento` | `.bento .tile .tile--wide` | Asymmetric bento grid of capability tiles |
| `A/carousel` | `.carousel__card` | Horizontal scroll card rail with head control |
| `A/node-timeline` | `.process__rail .step__node` | Vertical process rail with progress fill + numbered nodes |
| `A/metrics` | `.metrics .metric__v` | Big-number metric row |
| `A/quote` | `.quote__mark .quote__avatar` | Testimonial card with oversized quote mark |
| `A/faq-accordion` | `.faq__item .faq__q` | Vertical Q&A accordion |
| `A/cta-glow` | `.cta__glow .cta__particles` | Dark CTA slab with glow + particle field |
| `A/form-card` | `.form-card .field` | Contact form card w/ inline validation + success panel |
| `A/footer-grid` | `.footer__grid` | 4-column footer + address block + bar |

## A2 — `why-choose-us/`
`A2/comparison-ledger`, `A2/commitments-band`, `A2/principles-grid`, `A2/questions-accordion`.

## B — `prototype2/`

| Element | Class hooks | What it is |
| --- | --- | --- |
| `B/command-pill` | `.cmd__pill .cmd__div` | ONE centred pill: mark + links + CTA, hairline dividers, contracts on scroll |
| `B/chapter-marker` | `.chapter__n .chapter__rule` | Centred numeral on a short vertical rule above each section header |
| `B/hero-centred-dvh` | `.hero` (100dvh) | Full-viewport centred hero, eyebrow + measure-limited lead |
| `B/proof-bar` | `.proof__v .proof__l` | Centred value/label proof strip |
| `B/h-accordion` | `.cap__tab .cap__panel` | **Horizontal** expanding accordion; collapsed rails use vertical `writing-mode` labels; ARIA tablist |
| `B/case-rows` | `.case .case__stats` | Selected-work cases w/ stats + tags |
| `B/ladder` | `.ladder .rung .rung__node` | Centred engagement ladder; spine drawn as connectors *between* rungs |
| `B/people` | `.person .person__av` | Who-you-work-with row (placeholder people) |
| `B/reveal-cards` | `.rcard__face .rcard__back` | Claim → evidence flip/reveal on hover + click/keyboard |
| `B/commitment-bands` | `.band__ghost .band__k` | Full-width alternating bands with giant ghost numerals |
| `B/qa-grid` | `.qa` | Straight-answers Q&A grid (not an accordion) |
| `B/slab-inline-form` | `.slab__in .slab__alt` | CTA slab with the form inlined |
| `B/footer-centred` | `.foot__top .foot__bar` | Centred footer |

## C — `prototype2-archive/`

| Element | Class hooks | What it is |
| --- | --- | --- |
| `C/hero-split` | `.hero__grid` | Left-split hero: copy left, artifact right |
| `C/receipt` | `.receipt__row .receipt__tick` | "Engagement receipt" — itemised doc-like proof card |
| `C/sticky-problems` | `.problems__sticky .problem__q` | Sticky left question column, scrolling answers |
| `C/index-rows` | `.index__row .index__num .index__go` | Numbered index rows (work list) with tags + go-arrow |
| `C/case-feature` | `.case-feature__story` | One featured case, long-form |
| `C/schedule-ledger` | `.sched__row .week .day` | Week/day schedule ledger for the process |
| `C/clause` | `.clause__id .clause__figure` | Legal-clause styled facts |
| `C/pullquote` | `.pullquote__mark` | Editorial pull quote |
| `C/doc-frame` | `.doc__head .doc__foot` | Document-chrome wrapper (header/footer rules) |
| `C/nav-bar` | `.nav` | Full-width nav bar |
| `C/slab-grid` | `.slab__grid .slab__copy` | Two-column dark CTA slab |
| `C/footer-cols` | `.footer__col .footer__main` | Multi-column footer |

## D — `prototype2-new/`
Everything in C, plus:

| Element | Class hooks | What it is |
| --- | --- | --- |
| `D/stack-showcase` | `.stack .stack__chips .stack__why` | Technology-stack section: label + chips + why-this-stack |
| `D/hero-v1` | `.hero--v1 .v1-orb .v1-fade` | Alternate hero treatment with orbs + fade |
| `D/version-toggle` | `.ver-toggle` | Base/V1 switcher (dev affordance — **do not carry into P3**) |

---

## Shared across all (keep in P3)
`.btn` scale (`--primary/--ghost/--glow/--sm/--md/--lg/--block`), `.orb` gradient
system, `.skip-link`, `.sr-only`, `.grad--anim`, `.review-toggle` / `.ph-toggle`
placeholder outliner, reduced-motion handling, Outfit + Inter, inline Lucide SVG.
