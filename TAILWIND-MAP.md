# Next.js Port Notes — Prototype 3

**Decisions (2026-09-05):** the app is **Next.js + Tailwind v4**, ported after the
design is signed off. Prototype 3 is written *in Tailwind already*, so there is
no CSS translation step — only a JSX and hooks step.

**Why:** `DESIGN-SYSTEM.md` §0 specifies Tailwind v4 (`@theme`, oklch), and a live
probe of conversedatasolutions.com confirmed the reference site is itself Tailwind
v4 (`min-h-screen`, `py-24 bg-white`, oklch computed values). Prototypes 1–2 were
a hand-translation *away* from that notation. Prototype 3 returns to it.

---

## 1. Palette

`--slate-*` throughout is **Tailwind v4's stock slate** (oklch-derived). Verified
against both `DESIGN-SYSTEM.md` §2.2 and the live site.

> ⚠️ **Pin v4.** On v3 these differ (`v3 slate-500 = #64748b` vs `v4 #62748e`).
> Every neutral on the page shifts, silently, with nothing visibly broken.
> This is the highest-risk item in the port.

Only these are not stock — they live in `prototype3/theme.css`:

```css
:root {
  --primary / --brand:  #1f5da0   /* Interloid blue */
  --brand-light:        #3a7bc8
  --accent:             #289dbe   /* display sizes, icons, borders only */
  --accent-strong:      #1b7c99   /* AA-safe accent at body size (4.6:1) */
  --background:         #f7f9fc   /* tinted, NOT white */
  --card:               #ffffff
  --secondary:          #eef3f9   /* alternating section */
  --ink / --ink-deep:   #0f172a / #020617
}
```

> **Accent — corrected (2026-09-05).** An earlier note here claimed `#289dbe`
> was drift. That was wrong. Probing **interloid.com** found `#1f5da0` (28 text
> uses, 4 backgrounds, 3 borders) and `#289dbe` (24 text uses) with
> `linear-gradient(135deg, #1f5da0, #289dbe)` in 11+ places — Interloid's real
> brand. `#06b6d4` is *Converse's* accent and was imported by mistake.
> Prototypes 1–2 had this right. P3 now uses Interloid's palette.
>
> Contrast rule stands: `#289dbe` is 3.15:1 on white — display sizes, icons and
> borders only. Body-size accent text must use `--accent-strong` (#1b7c99).

---

## 2. What ports as-is

Everything visual. Class strings move to JSX unchanged; `class` → `className`.
The `@theme` block moves into `app/globals.css`. The `<style>` block (reveals,
rail, focus rings, placeholder outliner, reduced-motion) moves with it verbatim.

---

## 3. What must NOT become utility classes

Keep as real CSS. Utility-ising these is where fidelity actually dies:

1. **Scroll-reveal + rail transitions** — they use `var(--delay)` per element.
2. **`prefers-reduced-motion`** — the prototype flattens whole components at once;
   Tailwind's `motion-reduce:` variant is per-utility.
3. **`:focus-visible` ring composition** — HANDOFF §5.2: a component's own shadow
   out-cascades the ring, so the fix is a *composed* multi-shadow. Utilities
   cannot express that.
4. **Keyframes** (`gradient`, `marquee`, `orb`).

---

## 4. The real work: `script.js` → hooks

~380 lines. The content arrays (`SERVICES`, `BENTO`, `STEPS`, `CASES`, `STACK`)
were written to become `.map()` calls — lift them to module scope or a CMS.

| Prototype | Next.js |
| --- | --- |
| Nav class toggling on scroll | `useState` + `useEffect` scroll listener |
| Selector `renderSelector/renderPanel` | `useState(active)` + JSX |
| `IntersectionObserver` reveals | `useEffect` hook, or Framer Motion `whileInView` |
| Mobile menu class toggles | `useState(open)` |
| Cursor spotlight `pointermove` | `useRef` + handler on the card |

**Every `useEffect` needs a cleanup.** Without one, hot reload stacks scroll and
IntersectionObserver listeners — a failure mode the static prototype cannot have.

`DESIGN-SYSTEM.md` §0 names **Framer Motion** for reveals. Adopting it replaces
the `[data-reveal]` CSS with `whileInView` and removes the observer hook entirely;
the vocabulary (`opacity 0→1, y 20→0, 600ms, once, 100ms stagger`) is unchanged.

---

## 5. Port checklist (run at signoff)

- [ ] Pin **Tailwind v4** — verify `slate-500` resolves to `#62748e`.
- [ ] Replace the browser CDN `<script>` with a real Tailwind build.
- [ ] Merge `theme.css` + the inline `@theme inline` block into one
      `app/globals.css` (they are split in the prototype only because the
      Tailwind *browser* CDN cannot resolve a relative `@import`).
- [ ] Swap Google Fonts `<link>` → `next/font` (identical rendering, removes the
      current first-paint layout shift).
- [ ] Port `script.js` → hooks, with cleanups.
- [ ] Re-verify HANDOFF §5 gotchas. §5.3 (innerHTML icon swap) is already
      designed out — P3 toggles two SVGs by class, so nothing detaches, and the
      React version inherits that.
- [ ] Re-run the Playwright suite against the Next.js build.
- [ ] **Content gates (HANDOFF §7) are still open** — 8 `data-placeholder`
      elements remain, including three P0 case studies and two P0 legal pages.
