# Interloid Website Project — Session Handoff

**Last updated:** 2026-09-05 (evening) · Written to close a design session.
Read this first; it replaces re-reading the whole conversation.

**The next session is a CONTENT session.** The design direction is settled.
Start at §7 — those are the blockers, and they are business decisions.

---

## 1. What this project is

Redesigning **interloid.com** (Interloid Technologies Private Limited — a
senior product-engineering firm in Gobichettipalayam, Tamil Nadu, India).

Nothing has been deployed. The live site is untouched.

---

## 2. File map

| Path | What it is | Status |
| --- | --- | --- |
| `DESIGN-SYSTEM.md` | Visual language reverse-engineered from conversedatasolutions.com. **Reference only now** — see §4. | Stable |
| `INTERLOID-WEBSITE-REVIEW.md` | Content/strategy audit of the live site (~890 lines). **This is the key document for the next session.** | Stable |
| `PROTOTYPE3-BRIEF.md` | P3 build brief, section ledger, round log | Live |
| `TAILWIND-MAP.md` | Next.js + Tailwind v4 port notes and checklist | Live |
| `ELEMENT-CATALOGUE.md` | Element inventory of prototypes 1–2. Superseded; kept for reference. | Archive |
| `prototype3/` | **The active prototype.** See §3. | Active |
| `prototype/`, `why-choose-us/`, `prototype2/`, `prototype2-archive/`, `prototype2-new/` | Earlier explorations | Archive |

**Tooling:** Playwright + Chromium at repo root. Run scripts **from the repo root**.

---

## 3. prototype3/ — what each file is

| File | Status |
| --- | --- |
| `theme.css` | **The colour system. The only file to edit when re-theming.** |
| `index.html` + `script.js` | The full page: nav, hero, services, marquee, bento, process, work, CTA, footer |
| `hero-logo.html` + `hero-logo.js` + `logo-points.json` | ✅ **THE APPROVED HERO.** Not yet folded into `index.html`. |
| `hero-logo-lab.html` / `hero-lab.html` / `hero-3d.*` / `hero-order.*` / `hero-v2.*` / `hero-signal.html` | Exploration labs — **all superseded, safe to delete** |

**Serving:** must be served over http (Live Server is fine). `theme.css` loads
via `<link>`; opening `index.html` from the filesystem leaves it unstyled.

### The approved hero

Particles disperse into a cloud and re-condense into the **Interloid mark**, on
a 14-second auto loop. Dark by default, light toggle present.

- Logo sampled offline to `logo-points.json` (3,810 points, 48 KB) from the
  jittered-grid sampler. The 568 KB source asset is never shipped.
- No cursor interaction beyond ~20px of parallax. Glow, 360° orbit and all six
  lab interaction modes were tried and **rejected by the user**.
- No rotation of any kind — see gotcha §5.15, this bit us three times.

---

## 4. Decisions made this session — do not relitigate

| Decision | Detail |
| --- | --- |
| **Stack** | Next.js + **Tailwind v4**, ported after design signoff. Prototype is already written in Tailwind. |
| **Pin Tailwind v4** | The `slate` ramp differs between v3 and v4 (`v3 #64748b` vs `v4 #62748e`). On v3 every neutral shifts silently. |
| **Brand colours** | `#1f5da0` Interloid blue · `#289dbe` accent · `#3a7bc8` light. **Probed from the live interloid.com**, not invented. `#06b6d4` is *Converse's* accent and was imported by mistake earlier — do not reintroduce. |
| **Not white** | Page background is tinted `#f7f9fc`, cards are pure white. White-on-white read as flat. |
| **DESIGN-SYSTEM.md is reference, not law** | It was derived from Converse; following its §7.1 hero anatomy is what made every early hero look like a clone. The hero deliberately ignores it. The rest of the page still follows it. |
| **CTA labels** | Header "Let's talk" · panel "Book a call" · hero/mobile/slab "Book a free 30-min consult". Down from five labels to three. |
| **Nav** | 8 links, desktop pill at `xl:` (1280px). Below that, the mobile menu. |
| **Logo asset** | `.claude/skills/interloid-logo.svg` is a **PNG base64'd inside an SVG wrapper**, not a vector. Fine for particles; a real vector is still needed for favicon/small sizes. |

---

## 5. Hard-won gotchas — re-read before touching CSS/JS

1–11 are from earlier sessions and still apply. 12–17 are new.

1. **`overflow: hidden` on a section silently defeats `position: sticky`** inside it. Use `overflow: clip`.
2. **A component's own `box-shadow` out-cascades the global `:focus-visible` ring.** Compose the ring into the component's shadow, never replace.
3. **Swapping a toggle icon via `innerHTML` detaches the click's original target** → outside-click handler instantly re-closes the menu. Render two icons and toggle a class instead; then the bug cannot occur.
4. **A closed mobile menu hidden only with `opacity`/`pointer-events` keeps its links in the tab order.** Needs `visibility`/`display`.
5. **`overflow: hidden` on a card clips an outward focus ring** → use an inset ring.
6. **`IntersectionObserver` fractional thresholds never fire for tall elements at 400% zoom.** Use `threshold: 0` + `rootMargin`.
7. **A full-height centred timeline rail draws through centred text.** Draw connectors in the gaps.
8. **Contrast is direction-dependent.** `#289dbe` is 3.15:1 on white — display sizes, icons, borders only. Body-size accent text must use `#1b7c99`.
9. **Forms:** errors need `aria-describedby`; on success move focus to the confirmation.
10. **Playwright focus-ring assertions need ~500ms settle.**
11. **The Bash heredoc fails above ~48KB and on some quoting.** Use the Write tool for large files; write Python patches to a `.py` file rather than inlining.
12. **Tailwind's browser CDN cannot resolve a relative `@import`.** Using one silently produced a completely unstyled page. `theme.css` is loaded via `<link>` and the `@theme inline` mapping is inline in each HTML file. They rejoin as one `globals.css` in Next.js.
13. **A gradient headline cannot be split into word spans.** `background-clip: text` paints on the parent; inline-block children fall outside the clip and the text renders as **nothing**. Animate gradient lines as one block.
14. **A CSS keyframe that animates `transform` replaces the whole property** — it silently discarded the `translate` utilities positioning the orbs, and would cancel any JS parallax. Animate `opacity`, position with `left`/`top`, and write `element.style.translate` (not `transform`) from JS.
15. **Never rotate a flat point cloud.** `rotation.y = t * 0.05 * (1 - k)` is *cumulative in elapsed time* — measured 42° at 14s, 94° at 41s, 184° at 72s. Every pass through 90° collapses the flat cloud to a **line** and reads as a card flipping. It looks fine for the first cycle, which is why it survived review three times.
16. **`PointsMaterial` draws squares.** For round dots you need a `ShaderMaterial` with a circular alpha in the fragment stage. Square points were a large part of why particle builds read as "noise".
17. **`gl_PointSize` is in device pixels**, and additive blending is useless on light backgrounds (it only brightens). Blend mode must switch per theme.

---

## 6. Outstanding work

**Design (small, mechanical):**
1. Fold `hero-logo.html`'s hero into `index.html` as the real hero.
2. Delete the superseded labs listed in §3.
3. `about.html` and `career.html` are linked from nav and footer but **do not exist** — 4 links 404 today (flagged `data-placeholder`).
4. Not yet built: a Why page, and the §10.1 conversational form (the CTA is a `mailto`).

**Content — this is the next session's job. See §7.**

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
| **P1** | **No team/About surface.** "Who will I work with?" is unanswered. **Do not launch with invented people.** |
| **P1** | **Geography contradiction:** live meta says "Based in US & UK"; only address is Tamil Nadu, +91 phone. All prototypes use the honest framing "India-based · US & UK overlap hours" — needs user confirmation. |
| **P1** | **Pricing stance** — prototypes claim transparency but publish no ranges. |
| **P1** | **AWS Partner Network** claim needs a verifiable Partner-Finder link. |
| **P1** | Why page asserts the five commitments are "carried into every engagement agreement" — **verify against the real contract** or the page becomes fabricated proof. Currently flagged. |
| **P2** | Live site ships placeholder `google-site-verification` / `yandex-verification` meta values, and both Vercel analytics scripts 404 → **no traffic data exists**, so any before/after comparison starts at relaunch. |

**Allowed numeric claims** (the only ones any prototype states as fact —
everything else must be `data-placeholder` or removed): free 30-min consult ·
48-hr written proposal · weekly working demo · 30 days post-launch support ·
30-day notice · 100% code/IP ownership.

`prototype3/index.html` currently has **14 `data-placeholder` elements**. The
"Show placeholders" toggle (bottom-right) outlines every one with a label.

---

## 8. Conventions to keep

- Self-contained, no build step, but **serve over http**.
- Fonts: **Outfit** (display) + **Inter** (body). The live site loads no web
  font at all — that is the single most visible fix.
- Icons: **inline Lucide-style SVG only**. No emoji (the live site uses emoji
  as iconography; the review flags it as the most visible unpolish).
- Every prototype ships a **"Show placeholders"** toggle.
- `prefers-reduced-motion` fully honoured — the live site does this correctly
  and it is rare. Preserve it.
- Performance is an asset: the live site measures **FCP 364ms, 37 requests**,
  and the review says *"do not regress this."* WebGL must load after first
  paint, render only while on screen, and cap DPR at 2.

---

## 9. Quick commands

```bash
cd c:/Users/Hariprathap/Desktop/interloid

# serve (Live Server, or)
npx serve prototype3

# syntax check
node --check prototype3/script.js
```

Playwright scripts must be **ESM** (`.mjs`), run from the repo root, and use
`pathToFileURL(path.resolve(...)).href` for `file://` URLs. For WebGL under
Playwright add `--use-gl=swiftshader --enable-unsafe-swiftshader`.
