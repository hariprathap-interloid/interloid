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
| `theme.css` | **The colour system. The only file to edit when re-theming.** |
| `index.html` | Markup + the `@theme inline` mapping + non-utility CSS |
| `script.js` | Content arrays + behaviour (nav, selector, reveals, spotlight) |

No build step, but **it must be served over http** — Live Server is fine.
Opening `index.html` from the filesystem leaves it unstyled.

---

## 2. Section ledger

`State` = ☐ todo / ◐ built / ☑ approved (frozen).
**Frozen sections are not to be touched** unless an instruction names them.

| # | Section | DS ref | Notes | State |
| --- | --- | --- | --- | --- |
| 00 | Morphing nav | §6.1–6.5 | max-w-7xl→6xl, transparent→glass, 0→rounded-full, 300ms. Pill-in-pill links. | ◐ |
| 01 | Hero | §7.2 | min-h-screen slate-50, 3 orbs, `font-black` H1 (only place), animated gradient line 2 | ◐ |
| 02 | Services | §8.4 / §8.6 | 5/7 split: selector rows + L4 feature panel. ARIA tablist, roving tabindex | ◐ |
| 03 | Stack marquee | §8.10 | Tripled list, edge fades, 28s linear | ◐ |
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
touches one file; no component class changes.** A `.dark` block is declared and
verified working, but nothing activates it — DS §1.2 rule 1 is light-first.

The radius scale is one knob: `--radius: 0.75rem` drives `rounded-sm` …
`rounded-4xl` via `calc()`.

## 3. Verified (Playwright, 2026-09-05)

Matches the live reference exactly where it should:

| | Prototype 3 | conversedatasolutions.com |
| --- | --- | --- |
| H1 | Outfit 128px / 900 | Outfit 128px / 900 |
| Body | Inter, `slate-600` | Inter, `slate-600` |
| Hero bg | `--secondary` #eef3f9 | `slate-50` (retinted to brand) |
| Nav rest → scrolled | 1280 → 1152px, glass, rounded-full | 1280 → 1152px, glass, rounded-full |
| Page height | 6131px | 6151px |

Also passing: zero console errors · one `h1` · **no heading-level skips** · no
dead anchors · both fonts loading · all 26 reveals fire · the rail draws · tab
click + arrow keys switch the panel · mobile menu opens on a dead-centre tap
(HANDOFF §5.3) · 24 particles are seeded, so screenshot diffs stay meaningful.

---

## 4. Round log

| Round | Instruction | Touched | Outcome |
| --- | --- | --- | --- |
| 1 | Header from D's V1 · DS layout + auto-hide on scroll | 00 | Superseded by round 2 |
| 2 | Investigate conversedatasolutions.com; rebuild in Tailwind | all | ◐ built + verified |
| 3 | Too white — probe interloid.com, build a token-based brand theme | all | ◐ built + verified |

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
