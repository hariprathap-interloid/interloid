# Interloid Website Project — Session Handoff

**Last updated:** 2026-09-05 · Written to compact context for a fresh session.
Read this first; it replaces re-reading the whole conversation.

---

## 1. What this project is

Redesigning **interloid.com** (Interloid Technologies Private Limited — a
senior product-engineering firm in Gobichettipalayam, Tamil Nadu, India).

The work so far has produced two reference documents and three runnable
prototype explorations. Nothing has been deployed; the live site is untouched.

---

## 2. File map

| Path | What it is | Status |
| --- | --- | --- |
| `DESIGN-SYSTEM.md` | **Authoritative visual language** (~1,650 lines), reverse-engineered from conversedatasolutions.com via Playwright. Tokens, type, spacing, components, motion, a11y. | Reference — stable |
| `INTERLOID-WEBSITE-REVIEW.md` | **Authoritative content/strategy direction** (~890 lines). Full audit of the live site: structure, content, credibility, UX, IA recommendations, QA checklist. | Reference — stable |
| `prototype/` | **Prototype 1** — services-led, centred hero, floating-pill nav, selector+panel showcase, bento, node timeline. Has its own README. | Complete, reviewed, fixed |
| `why-choose-us/` | Standalone Why page built for Prototype 1 (comparison ledger + commitments band + accordion). Note: uses `style.css` singular. | Complete, reviewed, fixed |
| `prototype2/` | **Prototype 2 — CURRENT/ACTIVE.** Fresh centred, chaptered exploration (see §4). | Built + smoke-tested; **full review NOT yet run** |
| `prototype2-archive/` | The *previous* Prototype 2 (left-split hero + engagement receipt, sticky problems, index rows, schedule ledger). User rejected it as "too similar to the existing prototype". | Archived, reversible |
| `prototype2-new/` | **NOT created by me.** Appeared on disk at 10:01 between sessions. Left untouched — do not overwrite without asking. | Unknown provenance |
| `prototype-preview.png` | Full-page render of Prototype 1 | Artifact |

**Tooling:** Playwright + Chromium installed at repo root (`node_modules/`).
Run all scripts **from the repo root**.

---

## 3. How we got here (compressed)

1. **Installed Playwright, analysed conversedatasolutions.com** → produced
   `DESIGN-SYSTEM.md`.
2. **Audited interloid.com** → produced `INTERLOID-WEBSITE-REVIEW.md`.
3. **Built Prototype 1** (`prototype/`) as a design-system-conformant refactor.
4. **Built the missing Why page** (`why-choose-us/`).
5. **Built Prototype 2 v1** — problem-led four-act narrative. Later given a
   `dvh` hero, a technology-stack showcase, and a Base/V1 version switcher.
6. **User rejected it** as too close to Prototype 1 → **rebuilt Prototype 2
   from scratch** with a centred, chaptered direction inspired by the Converse
   *About* page. Old version moved to `prototype2-archive/`.

---

## 4. Current Prototype 2 — the active design

**Concept:** a centred, chaptered editorial document. Everything resolves to a
centre axis; content is revealed by expansion rather than by scrolling past cards.

**Files:** `index.html`, `why-choose-us.html`, `styles.css`, `script.js`
(no README yet — see §6).

**Signature devices (all new to this exploration):**
- **Centred command pill** — one pill holds mark + links + CTA with hairline
  dividers; contracts on scroll. (Not P1's three-across nav, not the archive's
  full-width bar.)
- **Chapter markers** — centred numeral on a short vertical rule above every
  section header.
- **Horizontal expanding accordion** for capabilities — collapsed rails show
  vertical `writing-mode` labels; WAI-ARIA tablist with roving tabindex.
- **Centred ladder** for the engagement — spine drawn as connectors *between*
  rungs (see gotcha #7).
- **Claim → evidence reveal cards** on the Why page (hover + click/keyboard).
- **Commitment bands** — full-width alternating bands with giant ghost numerals.
- Centred footer.

**Homepage:** Hero (100dvh) → Proof bar → 01 What we build → 02 Selected work
→ 03 How an engagement runs → 04 Who you work with → CTA slab w/ inline form → Footer.

**Why page:** Hero → 01 Five commitments (bands) → 02 In practice (reveal cards)
→ 03 Straight answers (Q&A grid) → CTA → Footer.

**Verified so far (smoke test only):** zero console errors, 1 h1/page, no
heading skips, all anchors resolve, Outfit+Inter loading, buttons `rounded-full`,
hero ≥ viewport height, 4 capability panels / 4 rungs / 4 people / 5 bands / 3 reveal cards.

**Documented deliberate deviation:** DS §16.4-C reserves centred headers for CTA
sections and §18.4 calls centred non-CTA headers an anti-pattern. This
exploration centres everything **by explicit user direction**. Noted in the
`styles.css` header comment. If this direction is adopted, amend DS §16.4.

---

## 5. Hard-won gotchas — re-read before touching CSS/JS

These were each found by adversarial review after passing a naive smoke test.
They recur across every prototype.

1. **`overflow: hidden` on a section silently defeats `position: sticky`**
   inside it (it creates a scroll container). Use `overflow: clip` — it clips
   the decorative orbs identically without the side effect.
2. **A component's own `box-shadow` out-cascades the global `:focus-visible`
   ring** at equal specificity, while the ring's `outline: none` still applies
   → keyboard focus becomes invisible. Every button with its own shadow needs
   an explicit `.btn--x:focus-visible { box-shadow: <ring>, <its own shadow> }`.
3. **Swapping a toggle icon via `innerHTML` detaches the click's original
   target**, so a document-level outside-click handler reads the click as
   "outside" and instantly re-closes the menu. Fix: `e.stopPropagation()` on the
   toggle **and** `e.composedPath().includes(...)` in the outside handler.
   *This bug made the mobile menu completely dead on tap and passed every
   naive test — always click the dead-centre of the button in QA.*
4. **A closed mobile menu hidden only with `opacity`/`pointer-events` keeps its
   links in the tab order and the a11y tree.** Needs `visibility: hidden` +
   `display: none` above the breakpoint.
5. **`overflow: hidden` on a card clips an outward focus ring** → use an
   `inset` ring for triggers inside clipped containers (accordion tabs).
6. **`IntersectionObserver` `threshold: 0.12` never fires for tall elements at
   400% zoom / reflow** (the element can't reach 12% of a shrunken root). Use
   `threshold: 0` and rely on `rootMargin`.
7. **A full-height centred timeline rail draws straight through centred text.**
   Draw the spine as connectors in the gaps between items instead.
8. **Contrast is direction-dependent:** `slate-400` = 2.63:1 on white (fails)
   but 7.66:1 on `slate-950` (passes). `slate-500` = 4.76:1 on white (passes)
   but 4.23:1 on `slate-950` (fails). Pick per background, never globally.
   Accent `#289dbe` is 3.15:1 on white — display sizes/icons/borders only;
   use `--accent-text: #1b7c99` (4.6:1) for body-size accent text.
9. **Forms:** errors need `aria-describedby` (not just `aria-invalid`), and on
   success move focus to the confirmation panel or focus is stranded on a
   now-hidden button.
10. **Playwright focus-ring assertions need ~500ms settle** — `box-shadow`
    transitions over 300ms give false negatives if measured immediately.
11. **The Bash tool's heredoc fails above ~48KB** (`ENAMETOOLONG`). Use the
    Write tool for large files, and for Python patch scripts write the `.py`
    to disk then run it (inline heredocs mangle quotes/backslashes).

---

## 6. Outstanding work

**Immediate (next session):**
1. **Run the adversarial review on the current `prototype2/`** — it was launched
   and interrupted, so the fresh build has only been smoke-tested. Five
   reviewers: design-system conformance, design-divergence (vs `prototype/`
   *and* `prototype2-archive/`), content credibility, a11y/code, runtime QA.
   Use the gotcha list in §5 as the checklist seed.
2. **Write `prototype2/README.md`** — the other prototypes have one; this build
   doesn't yet.
3. **Ask about `prototype2-new/`** — unknown provenance, currently untouched.

**Then:** apply review fixes; capture screenshots for the user to judge direction.

---

## 7. Content gates — business decisions, not design work

The review's core finding: the site is *technically competent and strategically
weak* — it asks for trust while showing no proof. These block launch of any
prototype and are **the user's calls, not ours**:

| Priority | Item |
| --- | --- |
| **P0 legal** | `/privacy-policy` returns **404** on the live site while the contact form requires consent to it. Also `/terms`. |
| **P0 trust** | **Zero case studies.** All proof in every prototype is `data-placeholder`. Needs 3 real ones (anonymised is fine — see review §9.5). |
| **P0 trust** | Live site's footer has **20 dead links** (Case Studies, Blog, Careers, Leadership, 5 Industries) all resolving to `/`. Do not port that footer forward. |
| **P1** | **No team/About surface.** "Who will I work with?" is unanswered. Prototype 2 has a People section with clearly-flagged placeholder people — **do not launch with invented people.** |
| **P1** | **Geography contradiction:** live meta says "Based in US & UK"; only address is Tamil Nadu, +91 phone. All prototypes use the honest framing "India-based · US & UK overlap hours" — needs user confirmation. |
| **P1** | **Pricing stance** — prototypes claim transparency but publish no ranges. |
| **P1** | **AWS Partner Network** claim needs a verifiable Partner-Finder link. |
| **P1** | Why page asserts the five commitments are "carried into every engagement agreement" — **verify against the real contract** or the page becomes fabricated proof. Currently flagged. |
| **P2** | Live site ships placeholder `google-site-verification` / `yandex-verification` meta values, and both Vercel analytics scripts 404 → **no traffic data exists**, so any before/after comparison starts at relaunch. |

**Allowed numeric claims** (the only ones any prototype states as fact —
everything else must be `data-placeholder` or removed): free 30-min consult ·
48-hr written proposal · weekly working demo · 30 days post-launch support ·
30-day notice · 100% code/IP ownership.

---

## 8. Conventions to keep

- Every prototype is **self-contained, no build step** — open `index.html`.
- Fonts: **Outfit** (display) + **Inter** (body) from Google Fonts. The live
  site loads *no* web font at all (`-apple-system`) — that's the single most
  visible fix.
- Icons: **inline Lucide-style SVG only**. No emoji (the live site uses emoji
  as iconography throughout; the review flags it as the most visible unpolish).
- Every prototype has a **"Show placeholders"** toggle (bottom-right) that
  outlines every `data-placeholder` element with a label saying what it needs.
- `prefers-reduced-motion` fully honoured — preserve this; the live site does
  it correctly and it's rare.
- Reveal motion: `{opacity:0, y:20}` → 600ms `easeOut`, `once: true`,
  ~100ms index stagger via `data-stagger`.

---

## 9. Quick commands

```bash
cd c:/Users/Hariprathap/Desktop/interloid

# open the active prototype
start prototype2/index.html

# syntax check
node --check prototype2/script.js
```

Playwright scripts must be **ESM** (`.mjs`), run from the repo root, and use
`pathToFileURL(path.resolve(...)).href` for `file://` URLs (string concatenation
breaks on Windows paths).

**Git note:** the last commit (`96eb311 protopy-2 updated`) accidentally
included scratch files (`.s-*.png`, `.p2*.mjs`, `.crop.mjs`). They've been
deleted from the working tree and are staged as deletions — commit that, and
consider adding `.*.mjs` / `.*.png` to `.gitignore`.
