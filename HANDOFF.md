# Interloid Website Project — Session Handoff

**Last updated:** 2026-09-06 · Written to close a design session.
Read this first; it replaces re-reading the whole conversation.

> **⚠️ THE PROTOTYPE PHASE IS OVER (2026-09-06).** Work moves to Next.js now,
> not after design signoff. Read §4a before doing anything in `prototype3/` —
> it is a reference artifact from here on, not the place to build.

**The next session builds the Next.js app.**

- Nav and hero are signed off (§3). Everything else is either a mechanical port
  or blocked on content — §6 is now a build backlog, not a design one.
- The content gates in §7 are the launch blockers, and they are business
  decisions the user must make, not design problems to solve around.

Read §4a first for the port decision and its order, then §6 and §7 together.
Several tasks are blocked on a content answer (there is no point styling a
case-study card before there is a case study), so sequence them rather than
treating them as two separate tracks.

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
| `INTERLOID-WEBSITE-REVIEW.md` | Content/strategy audit of the live site (~890 lines). **The key document for the content half.** | Stable |
| `PROTOTYPE3-BRIEF.md` | P3 build brief, section ledger, round log | **Closed** — reference |
| `TAILWIND-MAP.md` | Next.js + Tailwind v4 port notes, order of work, checklist | **Live — the active doc** |
| `ELEMENT-CATALOGUE.md` | Element inventory of prototypes 1–2. Superseded; kept for reference. | Archive |
| `next-js/` | **Where the app gets built.** Empty as of 2026-09-06 — scaffold here. | Active |
| `prototype3/` | The design reference to port from. Do not extend. See §3. | Reference |
| `prototype/`, `why-choose-us/`, `prototype2/`, `prototype2-archive/`, `prototype2-new/` | Earlier explorations. Non-Tailwind; only the contact form and the Why copy are worth taking (§4a). | Archive |

**Tooling:** Playwright + Chromium at repo root. Run scripts **from the repo root**.
The verification scripts are dot-prefixed (`.verify-index.mjs`, `.short-vp.mjs`,
`.dark-audit.mjs`, `.nav-crop.mjs`) so `.gitignore` keeps them out of the tree;
they serve `prototype3/` over http and must be rebuilt against `next dev` (§4a).

---

## 3. prototype3/ — what each file is

| File | Status |
| --- | --- |
| `theme.css` | **The colour system. The only file to edit when re-theming.** `:root` is light, `.dark` is live. |
| `index.html` + `script.js` | The full page: nav, hero, services, marquee, bento, process, work, CTA, footer |
| `hero-logo.js` + `logo-points.json` | ✅ **THE APPROVED HERO STAGE.** Now folded into `index.html`. |
| `hero-logo.html` | The animation on its own, for working on the motion without the page. |
| `hero-copy-lab.html` | The four hero copy/layout treatments. **C's layout + A's headline shipped**; the lab is the record of what was rejected, and is now behind `index.html` on copy. |
| `smaples-for-my-refernace/` | The exploration labs, kept for reference. All superseded — **nothing here ships.** Their `theme.css` / `logo-points.json` paths are `../`, so they only work from inside that folder. |

**Serving:** must be served over http (Live Server is fine). `theme.css` loads
via `<link>`; opening `index.html` from the filesystem leaves it unstyled.

### The approved hero

Particles disperse into a cloud and re-condense into the **Interloid mark**, on
a 14-second auto loop. It now lives in `index.html` as section 01, carrying
treatment **C's layout with A's contrast headline** — see PROTOTYPE3-BRIEF §4b
for the copy decision and the treatments that were not taken.

The page is **light by default with a working dark toggle in the nav**; the mark
reads in both. This supersedes the earlier "light-first, no dark mode" stance —
but only the hero is verified in dark (§6).

- Logo sampled offline to `logo-points.json` (3,810 points, 48 KB) from the
  jittered-grid sampler. The 568 KB source asset is never shipped.
- No cursor interaction beyond ~20px of parallax. Glow, 360° orbit and all six
  lab interaction modes were tried and **rejected by the user**.
- No rotation of any kind — see gotcha §5.15, this bit us three times.

---

## 4. Decisions made this session — do not relitigate

| Decision | Detail |
| --- | --- |
| **Stack** | Next.js + **Tailwind v4**. Prototype is already written in Tailwind. |
| **Port starts now** (2026-09-06) | **Supersedes "ported after design signoff."** Only nav + hero are signed off, so the sunk cost is small and only grows: every design pass run in the prototype from here is a pass run twice. See §4a. |
| **Pin Tailwind v4** | The `slate` ramp differs between v3 and v4 (`v3 #64748b` vs `v4 #62748e`). On v3 every neutral shifts silently. |
| **Brand colours** | `#1f5da0` Interloid blue · `#289dbe` accent · `#3a7bc8` light. **Probed from the live interloid.com**, not invented. `#06b6d4` is *Converse's* accent and was imported by mistake earlier — do not reintroduce. |
| **Not white** | Page background is tinted `#f7f9fc`, cards are pure white. White-on-white read as flat. |
| **DESIGN-SYSTEM.md is reference, not law** | It was derived from Converse; following its §7.1 hero anatomy is what made every early hero look like a clone. The hero deliberately ignores it. The rest of the page still follows it. |
| **CTA labels** | Header "Let's talk" · panel "Book a call" · hero/mobile/slab "Book a free 30-min consult". Down from five labels to three. |
| **Nav** | 8 links, desktop pill at `xl:` (1280px). Below that, the mobile menu. |
| **Logo asset** | `.claude/skills/interloid-logo.svg` is a **PNG base64'd inside an SVG wrapper**, not a vector. Fine for particles; a real vector is still needed for favicon/small sizes. |

---

## 4a. The port — decided 2026-09-06

**Build in Next.js from here.** `prototype3/` becomes a reference artifact: read
it, port from it, do not extend it. `TAILWIND-MAP.md` is the how; this is the
why and the order.

### Why now rather than after signoff

Nine sections are built but only **nav + hero** are approved, so what would be
thrown away is small — and it grows with every further prototype pass, because
each one is then done twice. What is still unsettled in the remaining sections
is unsettled for want of **content** (§7), not for want of design exploration,
and a prototype cannot fix that.

**Do not run a "gather components from prototypes 1–2 first" phase.** Measured
2026-09-06: `prototype/`, `prototype2/`, `prototype2-new/` and `why-choose-us/`
are each **788–957 lines of hand-written CSS with zero Tailwind**, on their own
custom-property systems. `prototype3/` is Tailwind v4 over a 109-line token
file. Moving a component across is a rewrite into a different styling paradigm
plus a retrofit onto the current tokens — the same work as writing it in
Next.js, done twice. This plan was also already tried and superseded once
(PROTOTYPE3-BRIEF round 2).

What those folders actually hold that `prototype3/` lacks, from a section-ID
diff, is **two things**:

| Item | Where | Take |
| --- | --- | --- |
| A **contact form** with `err-email`/`err-name` handling | `prototype2-new/`, `prototype2/`, `prototype/` | Yes — the markup and validation *pattern*. Not its CSS. |
| A **Why page** | `prototype2*/why-choose-us.html` | Its *copy* only, and only once §7 P1 verifies the five commitments |

Everything else in those folders stays archived. `ELEMENT-CATALOGUE.md` is the
index if you need to look.

### Order — the hero goes first, and it is not sentiment

1. **Nav + hero.** This proves the pipeline *and* front-loads the only genuinely
   order-dependent risk. The WebGL hero changes shape under Next — importmap +
   CDN `three` becomes an npm dependency in a dynamically-imported client
   component, and `fetch('logo-points.json')` becomes a public asset — and it is
   the single thing most likely to blow the FCP 364ms budget (§8). Find that out
   with two sections ported, not ten.
2. **Rebuild the Playwright harness against `next dev`, in week one.** This is
   the real, non-obvious cost of moving. The current harness measures the CTA
   against the mobile fold, H1 line count against column width, font loading,
   theme state and console errors — *every* hero regression of 2026-09-05/06 was
   caught by it and none by eye. It points at a static file server and does not
   survive the move. Rebuild it before it becomes the thing that is always
   postponed; the deferred checks below live in it.
3. **Sections 02–08 as-is.** Mechanical: the class strings are real Tailwind and
   `script.js`'s content arrays were written to become `.map()` calls.
4. **The contact form**, using `prototype2-new/`'s structure as reference.
5. **Content-blocked sections last** (Work, About, Why) — they wait on §7, and
   by then the component library exists anyway.

### Deferred to Next.js on purpose

Responsive, a11y, the 400% zoom/reflow pass, the dark audit of 02–08 and the
adversarial review are **deferred, not skipped**. The reasoning, so nobody
re-opens it: markup and class strings port unchanged, so these are the same
one-place fix on either side — and the port *centralises* repeated markup into
components, so a systemic issue that appears eight times in `index.html` is
usually **one** component fix in Next. Auditing first buys nothing.

Part of the a11y surface cannot even be tested until after the move, because it
does not exist yet:

- **Focus on route change.** Next's client-side navigation does not move focus
  to the new page. Impossible in a single HTML file; arrives the moment `about`
  and `career` become routes.
- **`useEffect` cleanup.** Without it, hot reload stacks scroll and
  IntersectionObserver listeners (TAILWIND-MAP §4).
- **Hydration vs. the theme class.** The inline no-flash script sets `.dark` on
  `<html>` before React hydrates — a classic mismatch source.

**Deferred means scheduled.** These belong in the rebuilt harness at step 2, not
on a someday list.

---

## 5. Hard-won gotchas — re-read before touching CSS/JS

1–17 are from earlier sessions and still apply. 18–20 came out of folding the hero into the page.

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
18. **A border token is not a text token.** The marquee and the inactive selector arrows used `text-border`; `--border` in dark is white at **10% alpha**, so both effectively disappeared. `--faint` now exists for faint *display text* — same value in light, opaque in dark.
19. **One theme owner.** `script.js` sets the `.dark` class; `hero-logo.js` only *observes* it (MutationObserver). Two owners is a race waiting to happen, so the stage was rewritten to observe rather than own. The class must also be resolved by an inline head script placed before the stylesheets, or a stored dark preference flashes light on every load.
20. **A hero designed at desktop width is not a mobile hero.** At `.30` scale the mark covered ~60% of a 390px viewport and ran through the H1, and the horizontal desktop scrim protected nothing once the layout stacked. Mobile needs its own scale, its own vertical scrim — and a second scrim layer capping the top, because the nav is transparent at rest and the cloud ran straight through the wordmark.
21. **`camera.aspect` on mobile is the SECTION's aspect, not the screen's.** The hero section is taller than the viewport there (the copy overflows it), so `FRAME.w = FRAME.h * w/h` collapses — at 390×944 it is 5.78 against a mark 5.32 wide, and sizing the mark off `FRAME.h` cropped it edge to edge. On narrow, cap `SCALE` on frame **width**. Same trap for position: a fraction of `FRAME.h` places the mark relative to the section, not the visible band, so read the section's own `padding-top` and centre inside that.
22. **Longer hero copy pushes the CTA off a 390×844 screen.** A 42-word lead was four lines on desktop and seven on mobile; both CTAs fell below the fold. The mobile fold is the binding constraint on hero copy — `.verify-index.mjs` measures the primary CTA's bottom edge against the viewport, so re-run it whenever that copy grows.
23. **Swapping a display face is not a swap.** Satoshi is wider than Outfit, so the hero H1's line 1 overflowed its column and wrapped mid-idea; it needed a size drop from 72px to 64px. It also has no 600 (300/400/500/700/900 only), which CSS silently resolves upward to 700. Check both the metrics and the weight ramp before calling a face swap done — and check the *system*: Geist was rejected because it reads as a heavier Inter, which is the body face, so it would have flattened the display/body contrast.
24. **`--brand` and `--primary` are the same value**, so a solid `--brand` headline is pixel-identical to the primary CTA — and in dark both resolve to `--accent`, so the collision exists in both themes. `--accent` is not the way out: at display size on `--secondary` it is **2.83:1**, under the 3:1 large-text floor. A brand→accent gradient is the fix; it is currently declined.
25. **The hero lead and the mark's mobile band are one budget.** `padding-top` has been 40 / 36 / 28 / 36vh across four copy passes, tracking the lead's length up and down, and `hero-logo.js` caps the mark's SCALE against that band. Longer copy shrinks the mark; shorter copy gives it back. Never change one without re-running `.verify-index.mjs`, which measures the CTA's bottom edge against the viewport.
26. **There is a hard ceiling on hero copy at 390×844, and 60 words is over it.** Mark band + badge + 3-line H1 + deck + 60-word body + two CTAs measures 1006px against an 844px fold. Below ~32vh the band stops clearing the transparent nav, so buying the 162px back means halving the mark, not just trimming it. Past this length, shaving margins is not a fix — one of the mark, the copy, or the fold has to give.
27. **Naming AI in the hero is a positioning decision, not a copy tweak.** "Senior engineers with agentic AI in the loop" reads as leverage for senior people; "AI-driven team" reads as cheap and automated — the exact fear the rest of the site answers. The site is sold on seniority end to end, so the AI must always follow the people in the sentence, never lead it. Also keep it distinct from "AI integration", which is a service §02 sells: how we build and what we sell are different claims.
28. **A directional scrim only protects one direction.** The hero's 90deg ramp shields the copy on the left; the nav is full-width and transparent at rest, so its right-hand controls sat over the bare cloud. Any full-width chrome over the stage needs its own cap, and that cap's stops belong in **px** (the nav's height is fixed) not %.
29. **z-index ties are broken by DOM order.** The hero's bottom fade and its copy were both `z-10`, the fade later in the markup — so the fade painted over both CTAs. Invisible at 900px tall, total washout at 1280×720. Sweep 1280/1440/1920/2560, not just one size: this, the scroll-cue collision and the H1 wrap were all found by the sweep and none by the default viewport.
30. **Headline size and column width are one unit.** At `2xl:text-7xl` (72px) line 1 needs ~830px and `max-w-3xl` is 768, so it wrapped mid-idea. Scale the column with the type or cap the type; never move one alone. `.short-vp.mjs` reports font size, column width and line count together for this reason.
31. **A pill badge cannot wrap.** "Senior product engineering · for founders and business leaders" is one line at 1440 and two at 390 — and a two-line pill puts the leading dot mid-left, so it reads as broken rather than as a wrapped label. Badge text has to fit the narrowest viewport on one line, which in practice means ~30 characters. Give the badge one clause and the lead the other.

---

## 6. Outstanding work — now a Next.js backlog

Ordered per §4a. Nothing here is prototype work any more.

**In the app, unblocked:**
1. Scaffold Next.js + Tailwind v4 in `next-js/` (empty today) and run the
   `TAILWIND-MAP.md` §5 checklist.
   Pinning v4 is listed there as the highest risk; the hero's first-paint cost
   is the one to *measure* first.
2. Port nav + hero, and measure the WebGL hero against FCP 364ms (§8).
3. Rebuild the Playwright harness against `next dev`. Every deferred check
   below lands here.
4. Port sections 02–08.
5. Build the §10.1 conversational contact form — the CTA is a bare `mailto`
   today. Form a11y is gotcha §5.9; `prototype2-new/` has a usable structure.

**Deferred into the app on purpose (§4a), not skipped:**
6. **The dark audit of 02–08.** The toggle ships and the hero is verified in
   both; 02–08 were only *spot-checked*. They mostly hold up because they are
   token-based, but contrast has been measured nowhere in dark, and
   `text-white` (12), `bg-white` (24) and `bg-white/*` borders remain in the
   tree — mostly the intentionally-dark CTA slab and footer, but the deliberate
   ones have never been separated from the accidental.
7. **A11y audit and the 400% zoom / reflow pass.** Plus the three Next-only
   items in §4a that cannot be tested before the move.
8. **The adversarial review, never run on this design at all.** Use §5 as the
   checklist seed — every gotcha in that list was found by review *after*
   something passed a naive smoke test.

**Blocked on a content answer (see §7) — do not build these blind:**
9. `about` and `career` are linked from the nav and footer but **do not exist**;
   4 links 404 today. About needs real team content, and §7 says do not launch
   with invented people.
10. The Why page. Its five commitments must be verified against the real
    contract first, or the page becomes fabricated proof.
11. Selected Work is three placeholder cards. Its final layout depends on what a
    real case study actually contains.

**Open design decision carried over:** the hero's mobile CTA sits 162px below an
844px fold (PROTOTYPE3-BRIEF §4e). Decide it during the hero port — accept it,
halve the mark on mobile, or show two sentences below `sm:`.

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
- Fonts: **Satoshi** (display, Fontshare) + **Inter** (body, Google). Satoshi replaced Outfit in round 9; it has **no 600**, and it is wider, which forced the hero H1 from 72px to 64px. The live site loads no web
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

# --- the app (from 2026-09-06) ------------------------------------------
# next-js/ is empty; scaffold there. Pin Tailwind v4 — TAILWIND-MAP §5.
cd next-js

# --- the design reference ------------------------------------------------
npx serve prototype3          # or Live Server; it MUST be served over http
node --check prototype3/script.js

# --- verification (dot-prefixed, gitignored) -----------------------------
node .verify-index.mjs        # hero: mobile fold, H1 lines, fonts, theme
node .short-vp.mjs            # 1280 / 1440 / 1920 / 2560 sweep
node .dark-audit.mjs          # per-section dark screenshots
```

Playwright scripts must be **ESM** (`.mjs`), run from the repo root, and use
`pathToFileURL(path.resolve(...)).href` for `file://` URLs. For WebGL under
Playwright add `--use-gl=swiftshader --enable-unsafe-swiftshader`.

The three verification scripts each spin up their own static server over
`prototype3/`. **They do not survive the port** — rebuild them against
`next dev` as step 3 of §4a, before the deferred a11y and zoom passes need
somewhere to live.
