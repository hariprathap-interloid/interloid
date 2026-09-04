# Design System & Pattern Guideline

A reverse-engineered design language reference, derived from a live audit of a modern
B2B enterprise-technology marketing site (Playwright DOM + CSS bundle + computed-style analysis).

**Purpose:** this document is a *generation guideline*. It describes the visual system,
component grammar, and motion rules in enough detail that a developer or an AI agent can
build a **brand-new website with original content** that reads as belonging to the same
design family. All example copy below is placeholder — write your own.

**Stack the system assumes** (swap freely, the tokens are portable):

| Layer | Choice |
| --- | --- |
| CSS | Tailwind CSS **v4** (`@theme` tokens, `oklch` palette) |
| Framework | React SPA (Vite) + client-side router |
| Motion | Framer Motion (`motion`) — `whileInView` scroll reveals |
| Icons | Lucide (24×24, `stroke-width: 2`, `currentColor`) |
| Fonts | Google Fonts — **Outfit** (display) + **Inter** (body) |
| Long-form text | `@tailwindcss/typography` (`prose`) |

---

## 1. Design System & Visual Language

### 1.1 The one-sentence identity

> **Bright, near-white "engineering lab" surfaces, punctuated by very large soft-blurred
> colour auras and deep-navy anchor blocks, with oversized geometric display type and
> generously rounded, floating glass cards.**

### 1.2 The eight non-negotiable rules

1. **Light-first.** The page is white / `slate-50`. There is no dark mode. Darkness is used
   *as an accent*, not as a theme — reserved for the CTA block, the footer, and one or two
   deliberate "hero object" panels per page.
2. **Depth via blur, not lines.** Separation comes from large soft shadows, giant
   `blur-[120px]` colour orbs, and `backdrop-blur` glass. Hard dividers are rare and
   always `slate-100`/`slate-200` hairlines.
3. **Very large radii.** Nothing is sharp. Cards are `1.5rem–2.5rem`; feature panels reach
   `3rem`; every button and pill is `rounded-full`.
4. **Two-tone headline rule.** Every section headline is split: neutral `slate-900` text
   plus **one** phrase in a `primary → accent` gradient. This is the single strongest
   brand signature — apply it consistently and never twice in one heading.
5. **Colour is functional, not decorative.** The chrome is monochrome navy/slate. Hue only
   appears in: gradient headline spans, icon tiles, category badges, and ambient orbs.
6. **Everything reveals on scroll.** Content enters with a short fade + 20–30px rise,
   staggered by index. Never animate more than ~600ms.
7. **Hover always lifts.** Cards translate up, icons scale up, arrows slide right. The
   cursor is always rewarded.
8. **Generous vertical rhythm.** Sections breathe at `py-24` → `py-32`. Crowding is the
   only thing that breaks the look.

### 1.3 Elevation ladder

```
L0  Page background        white / slate-50, optional dot- or line-grid
L1  Ambient orbs           blur-[100px…120px], 5–20% opacity colour, pointer-events-none
L2  Standard card          bg-white, border-slate-100, shadow-sm → shadow-xl
L3  Glass card             bg-white/60, backdrop-blur-xl, border-slate-200/80
L4  Feature panel          rounded-[3rem], shadow-[0_30px_80px_-15px_rgba(0,0,0,.1)], ring-1 ring-slate-900/5
L5  Floating nav pill      bg-white/80, backdrop-blur-lg, shadow-lg, rounded-full
L6  Dark anchor block      bg-slate-900/950 + inner radial glow + drifting particles
```

---

## 2. Colour Palette

### 2.1 Brand tokens (Tailwind v4 `@theme`)

```css
@theme {
  --color-primary:       #0b1120;  /* near-black navy — text, buttons, dark blocks   */
  --color-primary-light: #1e293b;  /* hover state for primary surfaces               */
  --color-accent:        #06b6d4;  /* cyan — the single brand highlight              */
  --color-accent-teal:   #14b8a6;  /* secondary highlight, gradient partner          */

  --font-sans:    "Inter", sans-serif;
  --font-display: "Outfit", sans-serif;

  --animate-gradient: gradient 8s linear infinite;
}
```

> **Re-branding:** change **only** `--primary` and `--accent`. Keep `primary` extremely
> dark and low-chroma, and `accent` a bright, saturated, *cool* hue. The whole system
> re-skins correctly from those two values.

### 2.2 Neutral ramp — the true workhorse

Slate carries ~85% of the design. Memorise these roles:

| Token | Hex | Role |
| --- | --- | --- |
| `slate-50`  | `#f8fafc` | Alternating section background, chip fills |
| `slate-100` | `#f1f5f9` | Card borders, hairline dividers, grid lines, ghost numerals |
| `slate-200` | `#e2e8f0` | Badge/outline-button borders, dot-grid dots |
| `slate-300` | `#cad5e2` | Placeholder text, marquee logo text, scrollbar thumb |
| `slate-400` | `#90a1b9` | Meta labels, eyebrow text, inactive icons |
| `slate-500` | `#62748e` | **Default body copy** |
| `slate-600` | `#45556c` | Nav links, secondary body copy |
| `slate-700` | `#314158` | Chip text, outline-button labels |
| `slate-800` | `#1d293d` | Dark-block gradient partner |
| `slate-900` | `#0f172b` | **Headings**, dark CTA block |
| `slate-950` | `#020618` | Footer |

### 2.3 Accent spectrum (categorical, not decorative)

Assign one hue per *category* (service, article topic, capability) and reuse it wherever
that category appears — icon tile, badge, glow.

```
sky-400    #00bcff    cyan-500    #00b8db    teal-500    #00bba7
blue-600   #155dfc    indigo-600  #4f39f6    emerald-500 #00bc7d
purple-500 #ad46ff    amber-500   #fe9a00    rose-500    #ff2056
```

### 2.4 Signature gradients

```html
<!-- A. Headline gradient — the brand signature. Use once per heading. -->
<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">phrase</span>

<!-- B. Animated hero gradient — 200% width panned by @keyframes gradient -->
<span class="bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600
             text-transparent bg-clip-text bg-[length:200%_auto] animate-gradient">phrase</span>

<!-- C. On-dark headline gradient -->
<span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">phrase</span>

<!-- D. Dark-block ambient wash -->
<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
            from-primary/30 via-slate-900 to-slate-900 pointer-events-none"></div>

<!-- E. Marquee edge fade -->
<div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
```

```css
@keyframes gradient { 0%   { background-position: 0%   }
                      50%  { background-position: 100% }
                      100% { background-position: 0%   } }
```

### 2.5 Ambient orbs — the atmosphere layer

Every major section gets 1–3. They are the reason the site feels "lit from behind."

```html
<div class="absolute top-0 right-0 w-[500px] h-[500px] rounded-full
            bg-accent/5 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
<div class="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full
            bg-primary/10 blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
```

**Rules:** `500–800px` square · `blur-[100px]`–`blur-[120px]` · opacity `/5` to `/20`
· always `pointer-events-none` · pushed half-off the section edge · parent needs
`relative overflow-hidden`, content needs `relative z-10`.

### 2.6 Background textures

```html
<!-- Dot grid, radially masked so it fades at the edges -->
<div class="absolute inset-0 -z-10
            bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] bg-[size:24px_24px]
            [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>

<!-- Line grid -->
<div class="absolute inset-0 -z-10
            bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)]
            bg-[size:32px_32px]
            [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>
```

---

## 3. Typography & Font Hierarchy

### 3.1 The two-family system

```
Outfit  (font-display) — weights 500 / 700 / 900 — ALL headings, numerals, button labels
Inter   (font-sans)    — weights 300–700         — body, UI, nav, meta
```

Outfit is a geometric grotesque: wide apertures, near-circular bowls. It is what makes
huge headlines feel confident rather than corporate. Substitutes with the same feel:
*Poppins, Plus Jakarta Sans, Sora, Manrope, General Sans*.

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;700;900&display=swap" rel="stylesheet">
```

### 3.2 Type scale

| Role | Classes | Notes |
| --- | --- | --- |
| **Hero H1** | `text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tight` | 60 → 96 → 128px. `font-black` (900) *only here*. |
| **Page H1** | `text-4xl md:text-6xl font-display font-bold tracking-tight leading-tight` | Inner-page heroes |
| **Section H2** | `text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight leading-tight` | ⚠️ **`font-medium` (500)** — the large size carries the weight, not the stroke. This restraint is signature. |
| **Section H2 (alt)** | `text-4xl md:text-5xl font-bold font-display leading-tight` | Used where the section is denser |
| **Card H3** | `text-xl lg:text-2xl font-bold font-display` | |
| **Feature H3** | `text-2xl md:text-3xl font-bold font-display` | Wide bento tiles |
| **Panel title** | `text-4xl font-bold font-display tracking-tight leading-tight` | Inside L4 feature panels |
| **Footer H4** | `text-white font-semibold mb-6` | Inter, not display |
| **Lead** | `text-xl text-slate-600 leading-relaxed max-w-3xl` | Under hero H1 |
| **Section intro** | `text-slate-500 mt-6 text-lg` | Under H2 |
| **Body** | `text-slate-500 leading-relaxed` | Default |
| **Card body** | `text-slate-500 leading-relaxed line-clamp-3` | Clamp for grid evenness |
| **Meta** | `text-xs font-semibold text-slate-400 tracking-wide` | Dates, read-time |
| **Eyebrow** | `text-[10px] font-bold uppercase tracking-widest text-slate-400` | Micro-label above a block |
| **Marquee label** | `text-xl font-bold text-slate-400 uppercase tracking-widest` | |

### 3.3 Typographic rules

- **Tracking:** `tracking-tight` (−0.025em) on every heading ≥ `text-4xl`.
  `tracking-widest` (0.1em) on every uppercase micro-label. Never in between.
- **Leading:** headings `leading-tight`/`leading-snug`; body `leading-relaxed`.
- **Measure:** lead paragraphs `max-w-3xl`; section intros `max-w-2xl`.
- **Manual line breaks:** headings use `<br>` to control the shape of a two-line
  headline — the *silhouette* is part of the design.
- **Two-tone rule (restated):** neutral clause + one gradient clause, always.

### 3.4 Long-form article typography

```html
<article class="prose prose-lg prose-slate max-w-none
                prose-headings:font-display prose-headings:font-bold prose-headings:text-primary
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-strong:text-primary
                prose-a:text-accent
                prose-blockquote:border-accent prose-blockquote:bg-slate-50 prose-blockquote:py-1
                prose-img:rounded-[32px]">
```

---

## 4. Spacing & Sizing

Base unit `0.25rem` (4px). Use only the 4/8-point ladder: **2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32**.

### 4.1 Canonical values

| Context | Value |
| --- | --- |
| Section padding (standard) | `py-24` (96px) |
| Section padding (spacious) | `py-32` (128px) |
| Section padding (band/marquee) | `py-20` (80px) |
| Page top offset (fixed nav) | `pt-20` … `pt-24` |
| Horizontal gutter | `px-4 sm:px-6` (mobile) → `px-6` (desktop) |
| Header → content gap | `mb-16` (64px) |
| Eyebrow → heading | `mb-6` |
| Heading → intro | `mt-6` |
| Card padding (standard) | `p-6 sm:p-8` |
| Card padding (bento) | `p-8` |
| Card padding (feature panel) | `p-12` |
| Card padding (image card) | `p-3` outer, `px-4 pb-4` inner |
| Grid gap (cards) | `gap-6` … `gap-8` |
| Grid gap (two-column layout) | `gap-12` … `gap-16` |
| Inline element gap | `gap-2` / `gap-3` / `gap-4` |
| Footer link list | `space-y-4` |

### 4.2 Fixed sizes

| Element | Size |
| --- | --- |
| Logo | `h-8 md:h-10 w-auto` |
| Icon (inline) | `w-4 h-4` / `w-5 h-5` |
| Icon tile (small) | `w-10 h-10 rounded-full` |
| Icon tile (standard) | `w-14 h-14 rounded-xl` or `rounded-2xl` |
| Icon tile (large) | `w-16 h-16 rounded-2xl` |
| Process node | `w-[80px] h-[80px] rounded-full border-[4px] border-white` |
| Arrow-circle affordance | `w-10 h-10 rounded-full border border-slate-200` |
| Carousel arrow | `w-14 h-14 rounded-full` |
| Primary button height | `h-14` (56px) hero · `py-4`/`py-5` elsewhere |
| Nav pill link | `px-5 py-2.5` |
| Bento row height | `lg:auto-rows-[300px]` |
| Card min-height | `min-h-[320px]` / `min-h-[500px]` |

---

## 5. Layout & Grid System

### 5.1 Containers

```
max-w-7xl (1280px)  ← the default. Nearly every section.
max-w-6xl (1152px)  ← scrolled nav pill
max-w-5xl / 4xl     ← article bodies, centred CTA copy
max-w-3xl           ← hero lead paragraph
max-w-2xl           ← section header block
```

Pattern: `<div class="max-w-7xl mx-auto px-6 relative z-10">`
(or `container mx-auto px-6 relative z-10` — both appear; pick one and be consistent).

Breakpoints are Tailwind defaults: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.

### 5.2 The five layout archetypes

**A. Centred hero** — `min-h-screen flex items-center justify-center text-center`, orbs behind, bottom gradient fade into the next section.

**B. Left-aligned section header** — this is the house style; section headers are *not*
centred (except the final CTA).

```html
<div class="text-left mb-16 max-w-2xl">
  <Badge/>  <H2/>  <Intro/>
</div>
```

**C. Split 5/7 interactive showcase** — a vertical selector list beside a large panel.

```html
<div class="hidden lg:grid grid-cols-12 gap-12 min-h-[500px]">
  <div class="col-span-5 flex flex-col justify-center gap-3"><!-- selectable rows --></div>
  <div class="col-span-7 relative flex items-center min-h-[500px]"><!-- panel --></div>
</div>
```

**D. Bento grid** — asymmetric, hero tile spans 2 columns.

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:auto-rows-[300px]">
  <div class="... lg:col-span-2">first / most important</div>
  <div class="... lg:col-span-1">…</div>
</div>
```

**E. Even card grid** — `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`.

### 5.3 Page skeleton (compose in this order)

```
FixedNav                 (transparent → morphs to floating pill)
Hero                     min-h-screen, centred, orbs, bottom fade
Offering showcase        white,     split 5/7 desktop / snap-carousel mobile
Logo marquee             white,     border-y slate-100, infinite scroll
Differentiators (bento)  slate-50,  glass tiles + cursor spotlight
Process timeline         white,     border-t, animated connector line
Insights / articles      white,     3-up image cards
CTA anchor               white section wrapping a dark rounded-[3rem] block
Footer                   slate-950, 4-column
```

Alternate `white` and `slate-50` between adjacent sections; add
`border-t border-slate-100` when two white sections meet.

---

## 6. Header & Navigation

### 6.1 The morphing nav — the signature interaction

A fixed bar that transforms into a floating glass pill on scroll (>~50px).

```html
<nav class="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4">
  <div class="relative flex items-center justify-between
              transition-all duration-300 ease-in-out
              {top     ? 'w-full max-w-7xl px-0 bg-transparent border border-transparent'
                       : 'w-full max-w-6xl px-6 py-3 bg-white/80 backdrop-blur-lg shadow-lg
                          border border-slate-200/20 rounded-full'}">
    <Logo/> <NavPill/> <CtaButton/> <MobileToggle/>
  </div>
</nav>
```

Three properties animate at once — **width** (`max-w-7xl` → `max-w-6xl`),
**surface** (transparent → `white/80` + `backdrop-blur-lg` + `shadow-lg`), and
**radius** (0 → `rounded-full`) — over `300ms ease-in-out`. Copy this exactly.

### 6.2 Nav link cluster

```html
<div class="hidden lg:flex items-center gap-1 bg-white/50 backdrop-blur-sm p-1
            rounded-full border border-white/20 shadow-sm">
  <a class="px-5 py-2.5 rounded-full text-sm font-medium text-slate-700
            hover:text-primary hover:bg-white transition-all
            flex items-center gap-1 group">
    Label
    <ChevronDown class="w-4 h-4 text-slate-400 group-hover:text-primary
                        transition-transform group-hover:rotate-180"/>
  </a>
</div>
```

The links live in their *own* translucent pill — a pill inside a pill. The chevron
rotates 180° on hover of the parent group.

### 6.3 Dropdown

```html
<div class="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl
            border border-slate-100 overflow-hidden p-2">
  <a class="block px-4 py-3 text-sm text-slate-600
            hover:bg-slate-50 hover:text-primary rounded-xl transition-colors">Item</a>
</div>
```
Enter: `opacity 0→1, y 10→0, scale .95→1`, ~200ms. Opens on hover (desktop).

### 6.4 Header CTA

```html
<a class="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-medium
          hover:bg-primary-light transition-all
          shadow-lg shadow-primary/20 hover:shadow-primary/40">Get in touch</a>
```

### 6.5 Mobile menu

Toggle `lg:hidden p-2 text-slate-700` (Menu ⇄ X). Panel is a **detached rounded card**,
not a full-screen overlay:

```html
<div class="absolute top-24 left-4 right-4 bg-white rounded-3xl shadow-2xl
            border border-slate-100 overflow-hidden lg:hidden p-6">
  <!-- top-level links; nested groups indented behind a border-l border-slate-100 -->
  <!-- full-width primary CTA at the bottom, above a border-t divider -->
</div>
```

---

## 7. Hero Section

### 7.1 Anatomy (top → bottom)

```
1  Ambient orb layer      3 blurred circles, mouse/scroll parallax
2  Eyebrow badge          pill: icon + short label
3  H1                     line 1 neutral · line 2 animated gradient
4  Lead paragraph         text-xl, slate-600, max-w-3xl
5  Button row             primary solid + secondary outline
6  Bottom fade            gradient into the next section's background
```

### 7.2 Reference implementation

```html
<section class="relative min-h-screen flex items-center justify-center
                overflow-hidden bg-slate-50 pt-20">

  <div class="absolute inset-0 z-0 pointer-events-none">
    <div class="absolute left-1/2 top-1/2 w-24 h-24 bg-blue-400/20   blur-xl rounded-full"></div>
    <div class="absolute left-1/2 top-1/2 w-32 h-32 bg-teal-400/20   blur-xl rounded-full"></div>
    <div class="absolute left-1/2 top-1/2 w-40 h-40 bg-purple-400/20 blur-xl rounded-full"></div>
  </div>

  <div class="container mx-auto px-6 relative z-20 text-center">

    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full
                bg-white border border-slate-200 shadow-sm mb-8">
      <Sparkles class="w-4 h-4 text-accent"/>
      <span class="text-sm font-medium text-slate-600">Eyebrow label</span>
    </div>

    <h1 class="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tight mb-8">
      <span class="block text-primary">First line</span>
      <span class="block bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600
                   text-transparent bg-clip-text bg-[length:200%_auto] animate-gradient">
        Second line
      </span>
    </h1>

    <p class="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
      One or two sentences of supporting copy.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-6">
      <PrimaryButton/> <SecondaryButton/>
    </div>
  </div>

  <div class="absolute bottom-0 left-0 right-0 h-32
              bg-gradient-to-t from-slate-50 to-transparent z-10"></div>
</section>
```

**Orb parallax:** each orb's `transform` is set imperatively from pointer position and
scroll offset — `translateX(±60…200px) translateY(±50…100px) scale(1.15…1.20)`.
Keep the displacement small (< 200px) and the scale subtle.

**Entrance:** badge, H1, paragraph, and button row each fade + rise
(`opacity 0→1, y 20→0`) with delays `0 / 0.1 / 0.2 / 0.3`.

### 7.3 Inner-page hero (lighter variant)

`pt-24 pb-20 bg-slate-50 min-h-screen relative overflow-hidden` · two pulsing orbs ·
`h1` at `text-4xl md:text-6xl` · optional accent underline instead of a gradient:

```html
<span class="text-accent underline decoration-accent/30 underline-offset-8">phrase</span>
```

---

## 8. Cards & Content Sections

### 8.1 Standard card

```html
<div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100
            shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)]
            relative overflow-hidden flex flex-col">
  <div class="absolute inset-0 pointer-events-none
              bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))]
              from-primary/5 via-transparent to-transparent"></div>
  <!-- content wrapped in relative z-10 -->
</div>
```

### 8.2 Glass bento tile (+ cursor spotlight)

```html
<div class="group relative flex flex-col justify-between overflow-hidden rounded-3xl
            border border-slate-200/80 bg-white/60 backdrop-blur-xl
            shadow-xl shadow-slate-200/40 p-8
            transition-all hover:bg-white/80 hover:border-slate-300/80
            hover:shadow-2xl hover:shadow-primary/10
            lg:col-span-2">

  <!-- spotlight: --x/--y updated on mousemove -->
  <div class="pointer-events-none absolute -inset-px rounded-3xl opacity-0
              transition duration-500 group-hover:opacity-100"
       style="background: radial-gradient(650px at var(--x) var(--y),
                                          rgba(6,182,212,0.04), transparent 80%)"></div>

  <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative z-10
              bg-white/80 backdrop-blur-md border border-white shadow-sm
              transition-transform duration-500 group-hover:scale-110">
    <Icon class="w-6 h-6 text-primary"/>
  </div>

  <div class="relative z-10 mt-auto">
    <h3 class="font-bold font-display text-slate-900 mb-3 text-2xl md:text-3xl">Title</h3>
    <p class="text-slate-500 font-medium leading-relaxed">One-line benefit.</p>
  </div>
</div>
```

`justify-between` + `mt-auto` pins the icon top-left and the text bottom-left —
that vertical split is what makes the bento read as *designed* rather than stacked.

### 8.3 Article / image card

```html
<a class="group block h-full flex flex-col bg-white rounded-[2.5rem]
          border border-slate-100 p-3 transition-all duration-500
          hover:-translate-y-2 hover:border-slate-200
          hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]">

  <div class="w-full aspect-[4/3] rounded-[2rem] mb-6 overflow-hidden relative bg-slate-100">
    <img class="w-full h-full object-cover
                group-hover:scale-110 transition-transform duration-700"/>
    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div class="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                bg-white/90 backdrop-blur-md text-primary
                text-[10px] font-bold uppercase tracking-widest shadow-sm">
      <Icon class="w-3 h-3"/> Category
    </div>
  </div>

  <div class="px-4 pb-4 flex-1 flex flex-col">
    <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wide mb-3">
      <Calendar class="w-3 h-3"/> 00/00/0000
    </div>
    <h3 class="text-2xl font-bold font-display text-primary mb-3
               group-hover:text-accent transition-colors leading-snug line-clamp-2">Title</h3>
    <p class="text-slate-500 leading-relaxed mb-8 line-clamp-3">Excerpt.</p>

    <div class="mt-auto border-t border-slate-100 pt-5 flex items-center justify-between">
      <span class="font-bold text-sm text-slate-900 group-hover:text-primary transition-colors">
        Read more
      </span>
      <div class="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center
                  group-hover:bg-primary group-hover:border-primary group-hover:text-white
                  transition-all duration-300 shadow-sm">
        <ArrowRight class="w-4 h-4"/>
      </div>
    </div>
  </div>
</a>
```

The **inset-image card** (outer `p-3` + `rounded-[2.5rem]`, image `rounded-[2rem]`) is a
key motif — the image sits *inside* a white frame rather than bleeding to the edge.

### 8.4 Feature panel (L4)

```html
<div class="absolute inset-0 rounded-[3rem] p-12 flex flex-col overflow-hidden
            bg-white border border-slate-100 ring-1 ring-slate-900/5
            shadow-[0_30px_80px_-15px_rgba(0,0,0,0.1)] text-slate-900">
  <div class="absolute inset-0 pointer-events-none
              bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))]
              from-primary/10 via-transparent to-transparent"></div>

  <div class="flex items-center gap-5 mb-8">
    <div class="w-16 h-16 rounded-2xl flex items-center justify-center
                shadow-lg shrink-0 text-white bg-blue-600"><Icon class="w-8 h-8"/></div>
    <h2 class="text-4xl font-bold font-display tracking-tight leading-tight">Title</h2>
  </div>

  <p class="text-xl leading-relaxed mb-8 max-w-3xl pr-4 text-slate-500">Description.</p>

  <div class="mb-auto"><div class="flex flex-wrap gap-3"><!-- chips --></div></div>

  <a class="… mt-12">Primary action</a>
</div>
```
Swapping panels: `opacity 0→1`, `filter blur(10px)→blur(0)`, `y 20→0`, ~400ms.

### 8.5 Tinted category card

```html
<div class="group relative w-full h-full min-h-[320px] rounded-[2rem]
            bg-white bg-blue-500/10 border border-slate-200/60 overflow-hidden
            shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col p-7 md:p-8
            transition-all duration-500 hover:-translate-y-2 hover:border-slate-200/90
            hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]">
  <div class="inline-flex p-3 rounded-xl text-white shadow-md border border-white/20
              bg-blue-500 transition-transform duration-300 group-hover:scale-105">
    <Icon class="w-6 h-6"/>
  </div>
  …
  <span class="inline-flex items-center gap-2 text-sm font-bold text-primary
               group-hover:text-accent transition-colors duration-300 pt-4 mt-auto">
    Learn more <ArrowRight class="w-4 h-4"/>
  </span>
</div>
```
Card tint `{hue}-500/10` + icon tile `{hue}-500` — one hue per category.

### 8.6 Selector row (split-layout left column)

```html
<!-- active -->
<div class="cursor-pointer group flex items-center justify-between p-4 rounded-2xl
            transition-all duration-300
            bg-white shadow-xl shadow-slate-200/50 border border-slate-100 scale-105">
  <div class="flex items-center gap-4">
    <div class="w-14 h-14 rounded-xl flex items-center justify-center
                text-white bg-blue-600 shadow-sm transition-colors"><Icon/></div>
    <h3 class="text-xl font-bold font-display transition-colors text-primary">Label</h3>
  </div>
  <ArrowRight class="w-5 h-5 text-primary"/>
</div>

<!-- inactive -->
<div class="cursor-pointer group flex items-center justify-between p-4 rounded-2xl
            transition-all duration-300 hover:bg-slate-50 border border-transparent">
  <div class="flex items-center gap-4">
    <div class="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm
                bg-slate-100 text-slate-400 group-hover:bg-slate-200 transition-colors"><Icon/></div>
    <h3 class="text-xl font-bold font-display transition-colors
               text-slate-600 group-hover:text-slate-900">Label</h3>
  </div>
</div>
```
Active = white + `shadow-xl` + `scale-105` + coloured icon tile.
Inactive = transparent + grey icon tile.

### 8.7 Chips / tags

```html
<span class="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg
             text-sm font-semibold text-slate-700 shadow-sm">Tag</span>

<span class="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg
             text-[11px] sm:text-xs font-semibold text-slate-700 shadow-sm">Tag</span>
```
Cap visible chips and append a muted `+N more`.

### 8.8 Eyebrow badge (used above every section header)

```html
<!-- on light -->
<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-white border border-slate-200 shadow-sm mb-6">
  <Icon class="w-4 h-4 text-accent"/>
  <span class="text-sm font-medium text-slate-600">Section label</span>
</div>

<!-- on dark -->
<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-white/5 border border-white/10 backdrop-blur-md shadow-sm mb-6
            text-sky-400 text-[11px] font-bold uppercase tracking-[0.2em]">
  <Icon class="w-3.5 h-3.5"/> Section label
</div>
```

### 8.9 Process timeline

Horizontal on desktop, vertical on mobile, with a connector line that **draws itself**.

```html
<div class="relative mt-20">
  <!-- desktop rail -->
  <div class="hidden lg:block absolute top-[44px] left-[5%] right-[5%] h-[2px] bg-slate-100"></div>
  <div class="hidden lg:block absolute top-[44px] left-[5%] right-[5%] h-[2px] origin-left
              bg-gradient-to-r from-primary via-accent to-emerald-400"
       data-motion="initial:{scaleX:0} whileInView:{scaleX:1} duration:1.5 ease:easeInOut delay:.2"></div>

  <!-- mobile rail: left-[39px] w-[2px], origin-top, scaleY 0→1 -->

  <div class="flex flex-col lg:flex-row gap-12 lg:gap-6 relative z-10 justify-between">
    <div class="flex flex-row lg:flex-col items-start lg:items-center relative w-full lg:w-1/4 group">
      <div class="shrink-0 relative flex items-center justify-center">
        <div class="w-[80px] h-[80px] rounded-full flex items-center justify-center
                    bg-white shadow-lg border-[4px] border-white z-10 relative
                    transition-all duration-500 group-hover:scale-110
                    group-hover:shadow-[0_0_30px_-5px_var(--tw-shadow-color)]
                    group-hover:shadow-primary/30">
          <div class="w-14 h-14 rounded-full flex items-center justify-center
                      bg-blue-50 border-blue-100 transition-colors"><Icon/></div>
        </div>
        <!-- oversized ghost numeral behind the node -->
        <div class="absolute -top-6 lg:-top-8 -right-4 lg:-right-8
                    text-[60px] lg:text-[80px] font-display font-bold text-slate-50
                    transition-colors z-0 select-none group-hover:text-primary/5">01</div>
      </div>
      <div class="ml-8 lg:ml-0 lg:mt-10 flex flex-col items-start lg:items-center
                  text-left lg:text-center pt-2">
        <h3 class="text-xl lg:text-2xl font-bold font-display text-slate-900 mb-3
                   group-hover:text-primary transition-colors">Step title</h3>
        <p class="text-slate-500 leading-relaxed text-base lg:text-sm xl:text-base">Description.</p>
      </div>
    </div>
  </div>
</div>
```

The **ghost numeral** (`text-slate-50`, `select-none`, warming to `text-primary/5` on hover)
is a reusable decorative device — reuse it for step numbers, week markers, and stats.

### 8.10 Infinite logo marquee

```html
<section class="py-20 bg-white border-y border-slate-100 overflow-hidden">
  <div class="max-w-7xl mx-auto px-6 text-center mb-10">
    <h3 class="text-xl font-bold text-slate-400 uppercase tracking-widest">Section label</h3>
  </div>
  <div class="flex w-full relative">
    <div class="absolute inset-y-0 left-0  w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
    <div class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
    <div class="flex gap-16 whitespace-nowrap px-8 items-center"><!-- items ×3 --></div>
  </div>
</section>
```

```html
<div class="flex items-center gap-3 text-2xl font-bold text-slate-300
            hover:text-primary transition-colors cursor-default"><Icon/> Name</div>
```
Triple the list, translate X linearly (`duration: 20–25s, repeat: Infinity, ease: linear`),
wrap at one-third width. Items are `slate-300` and colour up individually on hover.

### 8.11 3D flip card

```html
<div class="group h-[380px] w-full [perspective:1000px]">
  <div class="relative h-full w-full rounded-3xl shadow-sm hover:shadow-xl
              transition-transform duration-700 [transform-style:preserve-3d]
              group-hover:[transform:rotateY(180deg)]">
    <div class="absolute inset-0 [backface-visibility:hidden] …">front</div>
    <div class="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] …">back</div>
  </div>
</div>
```
Front carries an eyebrow + title + a muted `Hover to reveal →` hint.

### 8.12 Snap carousel

```html
<div class="relative group/carousel">
  <div class="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-6 px-6
              [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    <div class="w-[85vw] sm:w-[360px] md:w-[420px] snap-center shrink-0 …">card</div>
  </div>
  <button class="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 z-10 w-14 h-14
                 bg-white border border-slate-100 rounded-full
                 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center
                 text-slate-600 hover:text-primary hover:bg-slate-50 hover:scale-110
                 transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:flex">←</button>
</div>
```
Arrows are hidden until the carousel is hovered, and hidden entirely below `md`.

---

## 9. Buttons & CTAs

### 9.1 Primary — hero scale

```html
<a class="inline-flex h-14 items-center justify-center px-10 text-lg rounded-full font-medium
          transition-all duration-300
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
          bg-primary text-white hover:bg-primary/90
          shadow-xl shadow-primary/25 hover:shadow-primary/40
          active:scale-95">
  Label <ArrowRight class="w-5 h-5 ml-2"/>
</a>
```

### 9.2 Secondary — outline

```html
<a class="inline-flex h-14 items-center justify-center px-10 text-lg rounded-full font-medium
          transition-all duration-300
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
          border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50
          active:scale-95">Label</a>
```

### 9.3 Accent-shift button (in-panel)

```html
<a class="inline-flex justify-start items-center gap-3 px-8 py-4
          bg-primary text-white rounded-full font-bold text-lg
          hover:bg-accent transition-all shadow-lg hover:shadow-accent/30
          w-max mt-12 group/link">
  Label <ArrowRight class="w-5 h-5 transition-transform group-hover/link:translate-x-1"/>
</a>
```
**Navy → cyan on hover** is the house CTA behaviour. Use it in cards and panels.

### 9.4 Glow CTA (on dark)

```html
<a class="group relative inline-flex items-center justify-center gap-3 px-8 py-5
          bg-primary text-white rounded-full font-bold text-lg border border-white/10
          hover:bg-accent hover:scale-105 transition-all duration-300
          shadow-[0_0_40px_-10px_rgba(14,165,233,0.6)]
          hover:shadow-[0_0_60px_-10px_rgba(14,165,233,1)]">
  <span class="relative z-10 flex items-center gap-2">Label <ArrowRight class="w-5 h-5"/></span>
</a>
```

### 9.5 Inverse button (white on dark)

```html
<button class="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary
               rounded-full text-lg font-bold shadow-xl shadow-black/20
               hover:bg-slate-50 transition-all active:scale-95 animate-shine-button">
  Label <ArrowRight class="w-5 h-5"/>
</button>
```

### 9.6 Ghost / tertiary link-button

```html
<a class="inline-flex items-center gap-2 px-6 py-3 rounded-full
          border border-slate-200 text-slate-700 font-semibold font-display
          hover:border-primary hover:text-primary hover:bg-slate-50 transition-all">
  Label <ArrowRight class="w-4 h-4"/>
</a>
```

### 9.7 Full-width card button

```html
<a class="inline-flex items-center justify-center gap-2 w-full px-6 py-4
          bg-primary text-white rounded-full font-semibold text-sm
          hover:bg-accent transition-all shadow-md relative z-10 mt-auto group">Label</a>
```

### 9.8 Disabled

```html
<button disabled class="… bg-slate-100 text-slate-400 cursor-not-allowed">Label</button>
<!-- or: disabled:opacity-50 disabled:cursor-not-allowed -->
```

### 9.9 Button rules

- **Always `rounded-full`.** The only square-ish controls are the footer newsletter
  input/button (`rounded-lg`) — a deliberate contrast in a dark zone.
- **Always an arrow** on forward-motion CTAs; it slides right on hover.
- **Always `active:scale-95`** for tactile press feedback.
- **Shadow is tinted**, never plain black: `shadow-primary/25`, `shadow-accent/30`.
- **Focus:** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`.
- Max **two** buttons in a row: one solid, one outline.

### 9.10 Shine sweep (reserve for the single most important CTA)

```css
@keyframes shine { 0%   { opacity: 0; left: -100% }
                   20%  { opacity: .5 }
                   100% { opacity: 0; left: 100% } }

.animate-shine-button { position: relative; overflow: hidden; }
.animate-shine-button::after {
  content: ""; position: absolute; top: -50%; left: -100%;
  width: 40%; height: 200%; background: rgba(255,255,255,.4);
  transform: rotate(30deg); animation: shine 3s infinite;
}
```

---

## 10. Forms

### 10.1 Conversational "fill-in-the-blank" form

The most distinctive form pattern: the form *is* a sentence. Static prose in `slate-600`
alternates with underline-only inputs, all at display size.

```html
<div class="bg-white/80 backdrop-blur-2xl border border-slate-200/50
            p-8 md:p-12 md:pb-8 rounded-[40px] relative group overflow-hidden
            shadow-[0_8px_30px_rgb(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.08)]">

  <div class="absolute inset-0 rounded-[40px] pointer-events-none
              bg-gradient-to-br from-blue-50/50 to-transparent
              opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

  <div class="relative z-10 flex flex-col gap-4
              text-2xl md:text-3xl lg:text-4xl font-display leading-[1.6]">

    <div class="flex flex-wrap items-center gap-x-4">
      <span class="text-slate-600">Hi, I'm</span>
      <input type="text" placeholder="your name"
             class="bg-transparent border-b-2 border-slate-200 outline-none px-2 py-1
                    min-w-[250px] max-w-full text-primary placeholder:text-slate-300
                    transition-all duration-300 focus:border-accent"/>
    </div>

    <div class="flex flex-wrap items-center gap-x-4">
      <span class="text-slate-600">and I'm interested in</span>
      <button class="flex items-center gap-2 bg-transparent border-b-2 border-slate-200
                     outline-none px-2 py-1 cursor-pointer min-w-[200px]
                     text-primary hover:border-accent transition-all duration-300 group">
        <span class="text-slate-400">select an option</span><ChevronDown class="w-5 h-5"/>
      </button>
    </div>

    <textarea rows="1" placeholder="describe it…"
              class="bg-transparent border-b-2 border-slate-200 outline-none px-2 py-1
                     flex-grow w-full text-primary placeholder:text-slate-300
                     resize-none overflow-hidden transition-all duration-300
                     focus:border-accent"></textarea>

    <div class="flex justify-end">
      <button class="inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-medium
                     transition-all duration-300">Submit <ArrowRight class="w-5 h-5"/></button>
    </div>
  </div>
</div>
```

Rules: **no boxes, no labels** — only `border-b-2`; `slate-200` at rest → `accent` on
focus; placeholders `slate-300`; textarea auto-grows; submit stays disabled-grey until
valid, then becomes a solid primary pill.

### 10.2 Dark newsletter form (footer)

```html
<input type="email" placeholder="Enter your email"
       class="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white
              focus:outline-none focus:border-primary transition-colors"/>
<button class="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium
               hover:bg-primary-light transition-colors
               disabled:opacity-50 disabled:cursor-not-allowed">Subscribe</button>
```

---

## 11. Dark Blocks — CTA & Footer

### 11.1 CTA anchor block

A light section wrapping a dark, heavily rounded slab. This is the page's visual full stop.

```html
<section class="pt-8 pb-24 px-4 sm:px-6 relative bg-white">
  <div class="max-w-7xl mx-auto">
    <div class="relative overflow-hidden rounded-[3rem] bg-slate-900 shadow-2xl
                px-6 py-12 sm:px-16 sm:py-16
                flex flex-col items-center justify-center text-center">

      <div class="absolute inset-0 pointer-events-none
                  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
                  from-primary/30 via-slate-900 to-slate-900"></div>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px]
                  bg-accent/20 blur-[120px] rounded-t-full pointer-events-none"></div>
      <!-- 20–40 drifting particles: absolute rounded-full bg-white,
           1–4px, random left/top %, opacity .1–.3, slow y/x drift -->

      <div class="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <DarkBadge/>
        <h2 class="text-4xl md:text-5xl lg:text-7xl font-display text-white
                   font-medium tracking-tight leading-tight mb-8">
          First line<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
            second line
          </span>
        </h2>
        <GlowCta/>
      </div>
    </div>
  </div>
</section>
```

**Split variant** (left copy / right button): `p-8 md:p-12 rounded-[2.5rem] bg-slate-900
flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl`.

### 11.2 Footer

```html
<footer class="bg-slate-950 text-slate-300 py-20 border-t border-slate-800">
  <div class="container mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
      <div><!-- logo + one-line description (text-sm text-slate-400) --></div>
      <div>
        <h4 class="text-white font-semibold mb-6">Column</h4>
        <ul class="space-y-4 text-sm">
          <li><a class="hover:text-white transition-colors">Link</a></li>
        </ul>
      </div>
      <div><!-- second link column --></div>
      <div><!-- newsletter --></div>
    </div>
    <div class="border-t border-slate-900 pt-8 flex flex-col md:flex-row
                justify-between items-center text-xs text-slate-500">
      <p>© Year Company. All rights reserved.</p>
      <div class="flex gap-6 mt-4 md:mt-0"><!-- legal links --></div>
    </div>
  </div>
</footer>
```
Links rest at `slate-300`/`slate-400` and go to pure `white` on hover — that's the only
footer interaction.

---

## 12. Responsive Behaviour

### 12.1 Breakpoint strategy

`lg` (1024px) is the real hinge — it separates "app-like desktop composition" from
"stacked mobile document."

| Pattern | Mobile (< lg) | Desktop (≥ lg) |
| --- | --- | --- |
| Nav | Hamburger → floating card panel | Inline pill cluster + CTA |
| Split showcase | Horizontal snap carousel | 5/7 grid, list + panel |
| Bento | 1 col → `md:` 2 col | 3 col with `col-span-2` hero tile |
| Process | Vertical, left rail at `left-[39px]` | Horizontal, top rail at `top-[44px]` |
| Timeline text | Left-aligned | Centred |
| Carousel arrows | Hidden | Visible on hover |
| Card grid | 1 col | `md:` 2 → `lg:` 3 |

### 12.2 Fluid type

Scale headings across exactly **two or three** steps:

```
h1 hero    text-6xl  md:text-8xl  lg:text-9xl
h1 page    text-4xl  md:text-6xl
h2         text-4xl  md:text-5xl  lg:text-6xl
h3         text-xl   lg:text-2xl
body       text-base lg:text-sm  xl:text-base   ← intentional dip at lg for 4-up columns
```

### 12.3 Responsive spacing

```
py-24 / py-32   →   keep on mobile (the airiness is the point)
p-6 sm:p-8      →   card padding
px-4 sm:px-6    →   page gutter
gap-12 lg:gap-6 →   process steps: wider when stacked, tighter when in a row
```

### 12.4 Mobile carousel (replaces desktop split layouts)

```html
<div class="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-6 px-6
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
  <div class="w-[85vw] sm:w-[360px] md:w-[420px] snap-center shrink-0 …">…</div>
</div>
```
`w-[85vw]` deliberately peeks the next card — the affordance that says "swipe."

---

## 13. Animations & Transitions

### 13.1 Scroll-reveal vocabulary (the backbone)

Every content block enters once, on scroll. Measured distribution from the audit:

| Initial state | Frequency | Use for |
| --- | --- | --- |
| `{ opacity: 0, y: 20 }` | ~40% | **The default.** Any block. |
| `{ opacity: 0, y: 30 }` | ~10% | Larger cards / panels |
| `{ opacity: 0, x: -20 }` | ~12% | Left-column content |
| `{ opacity: 0, x: 20 }` | ~6% | Right-column content |
| `{ opacity: 0, y: 10 }` | ~3% | Small items, list rows |
| `{ opacity: 0, scale: 0.9 / 0.95 }` | ~5% | Icons, badges, medallions |
| `{ scaleX: 0 }` / `{ scaleY: 0 }` | rare | Timeline connector rails |
| `{ pathLength: 0, opacity: 0 }` | rare | SVG diagram strokes |

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
/>
```

`viewport={{ once: true }}` on **everything** — animations never replay.
Occasionally `{ once: true, amount: 0.3 }` or `{ once: true, margin: "-100px" }`.

### 13.2 Stagger

```jsx
transition={{ delay: 0.3 + index * 0.1 }}   // cards, steps  (100ms apart)
transition={{ delay: 0.3 + index * 0.05 }}  // dense lists   (50ms apart)
```
Section-header internals use fixed delays: badge `0`, heading `0.1`, intro `0.2`, action `0.3`.

### 13.3 Durations

```
150ms   default micro (Tailwind base)
300ms   colour / shadow / nav morph / most hovers   ← the workhorse
400ms   panel swap
500ms   card lift, icon scale, spotlight fade
700ms   image zoom, 3D flip, gradient wash
1000ms  slow background image zoom
1500ms  timeline rail draw
```
Easing: `easeOut` for entrances, `ease-in-out` for reversible states, `linear` for loops.

### 13.4 Continuous loops

```
20–25s linear          → logo marquee
8s     linear          → hero headline gradient pan
2–4s   linear/easeInOut→ orb drift, particle float, pulse
3s                     → shine sweep
2s                     → shimmer sweep
```

### 13.5 Shimmer (skeletons / loading)

```css
@keyframes shimmer { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }
.animate-shimmer { position: relative; overflow: hidden; }
.animate-shimmer::after {
  content: ""; position: absolute; inset: 0 auto auto 0; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent);
  animation: shimmer 2s infinite;
}
```

### 13.6 Scroll behaviour

```css
html, body { scroll-behavior: smooth; }
```
Anchor targets use `scroll-mt-32` to clear the fixed nav.

---

## 14. Hover & Interaction Patterns

### 14.1 The `group` idiom

Nearly every card is a `group`; children respond to the parent's hover. Nested groups use
named variants — `group/link`, `group/carousel`, `group/btn`.

### 14.2 Hover catalogue

| Element | Hover behaviour |
| --- | --- |
| Card (lift) | `hover:-translate-y-2` + shadow deepens, `duration-500` |
| Card (glass) | `hover:bg-white/80 hover:border-slate-300/80 hover:shadow-2xl hover:shadow-primary/10` |
| Card image | `group-hover:scale-110 transition-transform duration-700` |
| Card title | `group-hover:text-accent transition-colors` |
| Card arrow-circle | `group-hover:bg-primary group-hover:border-primary group-hover:text-white` |
| Inline arrow | `group-hover:translate-x-1` |
| Icon tile | `group-hover:scale-105` / `group-hover:scale-110`, `duration-500` |
| Nav chevron | `group-hover:rotate-180` |
| Nav link | `hover:text-primary hover:bg-white` (fills its own pill) |
| Primary button | `hover:bg-primary/90`, shadow `/25 → /40` |
| Accent button | `hover:bg-accent hover:shadow-accent/30` |
| Glow button | `hover:scale-105` + glow radius grows |
| Marquee item | `text-slate-300 → hover:text-primary` |
| Footer link | `hover:text-white` |
| Process node | `group-hover:scale-110` + coloured glow ring |
| Ghost numeral | `text-slate-50 → group-hover:text-primary/5` |
| Flip card | `group-hover:[transform:rotateY(180deg)]` |
| Carousel arrows | `opacity-0 → group-hover/carousel:opacity-100` |
| Any button press | `active:scale-95` |

### 14.3 Cursor spotlight (bento)

```jsx
onMouseMove={e => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}}
```
Paired with the `-inset-px` radial overlay from §8.2. Keep the alpha at **0.04** — it
should register subliminally, never as a visible blob.

### 14.4 Reveal-on-hover overlays

```html
<div class="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<div class="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-700
            pointer-events-none rounded-[40px]"></div>
```

---

## 15. Border Radius, Shadows & Borders

### 15.1 Radius scale — memorise this

| Value | Class | Applied to |
| --- | --- | --- |
| `0.5rem` | `rounded-lg` | Chips, dark-zone inputs & buttons |
| `0.75rem` | `rounded-xl` | Icon tiles, dropdown items |
| `1rem` | `rounded-2xl` | Selector rows, dropdown panel, large icon tiles |
| `1.5rem` | `rounded-3xl` | **Default card radius**, mobile menu |
| `2rem` | `rounded-[2rem]` | Inset images, tinted cards |
| `2.5rem` | `rounded-[2.5rem]` | Article cards, split CTA |
| `32px / 40px` | `rounded-[32px]` / `rounded-[40px]` | Contact card, dark side-panels |
| `3rem` | `rounded-[3rem]` | Feature panels, main CTA slab |
| `9999px` | `rounded-full` | **All** buttons, badges, pills, avatars, nav |

> Larger surface ⇒ larger radius. A `rounded-lg` card or a square button both break the language instantly.

### 15.2 Shadow ladder

```
shadow-sm                                          badges, chips, small tiles
shadow-md                                          icon tiles, in-card buttons
shadow-lg                                          nav pill, process nodes, header CTA
shadow-xl                                          hero buttons, active selector rows
shadow-2xl                                         dark blocks, mobile menu

/* tinted — the house style */
shadow-xl  shadow-slate-200/40                     glass bento tiles
shadow-lg  shadow-primary/20                       header CTA
shadow-xl  shadow-primary/25  →  /40 on hover      primary buttons
hover:shadow-2xl hover:shadow-primary/10           bento hover

/* custom, arbitrary */
shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]          barely-there resting card
shadow-[0_8px_30px_rgb(0,0,0,0.04)]                soft resting card
shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)]         mobile carousel card
shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]        card hover
shadow-[0_30px_80px_-15px_rgba(0,0,0,0.1)]         feature panel
shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]         article card hover — very tall, very soft
shadow-[0_0_40px_-10px_rgba(14,165,233,0.6)]       glow CTA
shadow-[0_8px_30px_rgb(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.08)]   layered contact card
```

**Shadow doctrine:** large negative spread + large Y offset + low alpha (0.03–0.1).
Shadows are *wide and faint*, never tight and dark. Tint them with the brand hue.

### 15.3 Borders

```
border border-slate-100        default card border (nearly invisible — a seam, not a line)
border border-slate-200        badges, outline buttons, inputs
border border-slate-200/80     glass tiles (semi-transparent)
border border-slate-300        secondary buttons
border border-white            icon tiles on glass
border border-white/10 … /20   elements on dark surfaces
border-b-2 border-slate-200    underline inputs → focus:border-accent
border-[4px] border-white      process node rings
border-y  border-slate-100     full-width band sections
border-t  border-slate-100     white-on-white section separation
border-t  border-slate-800/900 footer dividers
ring-1 ring-slate-900/5        extra definition on feature panels
```

### 15.4 Custom scrollbar

```css
::-webkit-scrollbar        { width: 6px; height: 6px }
::-webkit-scrollbar-track  { background: transparent }
::-webkit-scrollbar-thumb  { background: #cbd5e1; border-radius: 10px }
::-webkit-scrollbar-thumb:hover { background: #94a3b8 }
*                          { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent }

.no-scrollbar::-webkit-scrollbar { display: none }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none }
```

---

## 16. Section Spacing & Page Structure

### 16.1 Vertical rhythm

```
Hero              min-h-screen  pt-20
Standard section  py-24
Spacious section  py-32
Band / marquee    py-20
Bridged sections  pt-32 pb-8   →  pt-8 pb-24    (two sections reading as one unit)
Footer            py-20
```

The `pb-8` → `pt-8` bridge deliberately pulls the final CTA tight against the section
above it, so they read as a single closing movement.

### 16.2 Background alternation

```
Hero        slate-50
Section 1   white
Section 2   white  + border-y slate-100      (band)
Section 3   slate-50
Section 4   white  + border-t slate-100
Section 5   white  + border-t slate-50
CTA         white wrapper → slate-900 slab
Footer      slate-950
```

### 16.3 Section boilerplate

```html
<section class="py-32 bg-white relative overflow-hidden border-t border-slate-100">
  <!-- 1. ambient orbs -->
  <div class="absolute top-0 right-0 w-[600px] h-[600px] rounded-full
              bg-primary/5 blur-[120px] pointer-events-none
              -translate-y-1/2 translate-x-1/2"></div>

  <!-- 2. content -->
  <div class="max-w-7xl mx-auto px-6 relative z-10">
    <div class="text-left mb-16 max-w-2xl">
      <EyebrowBadge/>
      <h2 class="text-4xl md:text-5xl lg:text-6xl font-display text-slate-900
                 font-medium tracking-tight leading-tight">
        Neutral phrase
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          gradient phrase
        </span>
      </h2>
      <p class="text-slate-500 mt-6 text-lg">Supporting sentence.</p>
    </div>
    <!-- section body -->
  </div>
</section>
```

`relative overflow-hidden` on the section + `relative z-10` on the content is
**mandatory** — without it the orbs either clip the layout or cover the text.

### 16.4 Section header variants

```html
<!-- A. Standard: left-aligned -->
<div class="text-left mb-16 max-w-2xl"> Badge · H2 · Intro </div>

<!-- B. With trailing action -->
<div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
  <div class="max-w-2xl"> Badge · H2 </div>
  <div><GhostButton>View all</GhostButton></div>
</div>

<!-- C. Centred — CTA sections only -->
<div class="text-center max-w-4xl mx-auto"> Badge · H2 · CTA </div>
```

---

## 17. Reusable Component Inventory

Build these once; every page is an arrangement of them.

| # | Component | Key props |
| --- | --- | --- |
| 1 | `<MorphingNav>` | links[], cta, scrollThreshold |
| 2 | `<NavDropdown>` | items[] |
| 3 | `<MobileMenuPanel>` | groups[], cta |
| 4 | `<EyebrowBadge>` | icon, label, tone: light \| dark |
| 5 | `<GradientHeading>` | neutral, gradient, level, size |
| 6 | `<SectionHeader>` | badge, heading, intro, action, align |
| 7 | `<AmbientOrb>` | size, color, position, blur |
| 8 | `<GridBackdrop>` | variant: dots \| lines |
| 9 | `<Hero>` | badge, headline, lead, primaryCta, secondaryCta |
| 10 | `<Button>` | variant: primary \| secondary \| accent \| glow \| inverse \| ghost; size |
| 11 | `<IconTile>` | icon, size, color, shape, variant: solid \| glass \| muted |
| 12 | `<Chip>` | label, size |
| 13 | `<GlassCard>` | span, spotlight |
| 14 | `<FeatureCard>` | icon, title, body, tint |
| 15 | `<ArticleCard>` | image, category, date, title, excerpt, href |
| 16 | `<FeaturePanel>` | icon, title, body, chips[], cta, accentColor |
| 17 | `<SelectorList>` | items[], activeIndex, onChange |
| 18 | `<SplitShowcase>` | items[] (composes 17 + 16 + mobile carousel) |
| 19 | `<BentoGrid>` | items[] (first item spans 2) |
| 20 | `<ProcessTimeline>` | steps[] (icon, number, title, body, color) |
| 21 | `<Marquee>` | items[], speed, direction, fadeColor |
| 22 | `<SnapCarousel>` | children, arrows |
| 23 | `<FlipCard>` | front, back, height |
| 24 | `<DarkCtaBlock>` | badge, headline, cta, layout: centered \| split |
| 25 | `<ConversationalForm>` | fields[] (sentence fragments + inputs) |
| 26 | `<UnderlineInput>` | type, placeholder, minWidth |
| 27 | `<Footer>` | columns[], newsletter, legal[] |
| 28 | `<Reveal>` | direction, delay, index — wraps `whileInView` |
| 29 | `<GhostNumeral>` | value, size |
| 30 | `<ArrowCircle>` | size — the `w-10 h-10` hover-fill affordance |

### 17.1 `<Reveal>` — write this first

```jsx
const VARIANTS = {
  up:    { opacity: 0, y: 20 },
  upLg:  { opacity: 0, y: 30 },
  left:  { opacity: 0, x: -20 },
  right: { opacity: 0, x: 20 },
  scale: { opacity: 0, scale: 0.95 },
  fade:  { opacity: 0 },
}

export function Reveal({ children, variant = 'up', delay = 0, index = 0,
                         step = 0.1, duration = 0.6, className }) {
  return (
    <motion.div
      className={className}
      initial={VARIANTS[variant]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration, ease: 'easeOut', delay: delay + index * step }}
    >{children}</motion.div>
  )
}
```

Every other component composes with it. Getting this one right gets the motion of the
entire site right.

---

## 18. Design Principles for a New Site

### 18.1 The ten rules

1. **Two fonts, two roles.** A geometric display face for every heading, a neutral
   grotesque for everything else. Never mix a third.
2. **One accent, used sparingly.** If more than ~5% of the pixels are accent-coloured,
   remove some. Grey carries the design; colour points at things.
3. **Split every headline.** Neutral clause + one gradient clause. It is the cheapest,
   most recognisable brand device in the system.
4. **Round everything, proportionally.** Bigger surface, bigger radius. Buttons always
   fully round.
5. **Shadows are wide, soft, and tinted.** Large blur, large negative spread, alpha under
   0.1, hue borrowed from the brand.
6. **Light by default, dark for emphasis.** Exactly two dark zones per page: the closing
   CTA and the footer. Scarcity is what gives them weight.
7. **Every section is lit from behind.** One to three giant blurred orbs, always
   `pointer-events-none`, always behind `z-10` content.
8. **Reveal once, subtly, staggered.** 20–30px of travel, ~600ms, `once: true`, 100ms apart.
9. **Reward every hover.** Lift, scale, colour-shift, or slide — nothing interactive stays
   inert. `active:scale-95` on all presses.
10. **Let it breathe.** `py-24`/`py-32` sections, `mb-16` header gaps, `gap-6`/`gap-8`
    grids. When unsure, add space.

### 18.2 Composing a new page

```
1  Choose the section sequence from §5.3.
2  Alternate white / slate-50; add hairline borders where whites meet.
3  Give every section: relative overflow-hidden + orbs + relative z-10 content.
4  Open each with the §16.4 header (badge → gradient H2 → intro).
5  Pick one layout archetype per section — never two grids in a row.
6  Wrap each block in <Reveal> with an index-based stagger.
7  Close with the dark CTA slab, then the footer.
```

### 18.3 Rhythm — vary the layout archetype

Never place two identical grids back to back. A good page alternates:

```
centred hero → split showcase → thin band → asymmetric bento
→ horizontal timeline → even card grid → dark slab
```

Vary **density** too: a full-bleed marquee after a dense bento acts as a rest.

### 18.4 Anti-patterns

| Don't | Do |
| --- | --- |
| Sharp corners, `rounded-md` cards | `rounded-3xl` and up |
| Square/pill-less buttons | `rounded-full`, always |
| Hard `1px solid #ccc` dividers | `border-slate-100` hairlines, or nothing |
| Tight black shadows | Wide, soft, tinted shadows |
| Pure `#000` text | `slate-900` / `primary` (`#0b1120`) |
| Bold weight on giant headings | `font-medium` at `text-6xl` — size *is* the emphasis |
| Rainbow sections | Monochrome chrome, colour only in accents |
| Replaying scroll animations | `viewport={{ once: true }}` |
| Animations > 700ms on content | 300–600ms |
| Centred section headers everywhere | Left-aligned; centre only the hero and CTA |
| Full-screen mobile menu overlay | Detached `rounded-3xl` floating card |
| Cramped `py-12` sections | `py-24` / `py-32` |

### 18.5 Accessibility notes

- `slate-500` on white ≈ 4.8:1 — passes AA for body text. Do **not** go lighter than
  `slate-500` for anything readers must read; `slate-400` is for decorative labels only.
- Accent `#06b6d4` on white is ~2.4:1 — **never use it for body text**. It is safe for
  large gradient headlines, icons, and borders. On `slate-900` it is comfortably legible.
- Gradient-clipped text must keep a solid fallback colour for forced-colors mode.
- Keep `focus-visible:ring-2 focus-visible:ring-primary` on every interactive element —
  the design leans on hover, so keyboard focus must be equally loud.
- Wrap continuous loops (marquee, orbs, shine, particles) in
  `@media (prefers-reduced-motion: reduce)` and disable them; reduce `<Reveal>` to a
  plain opacity fade.
- Blurred orbs and particles must always be `pointer-events-none` and `aria-hidden`.

---

## 19. Copy-Paste Starter Kit

### 19.1 Tailwind v4 theme

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --font-sans:    "Inter", sans-serif;
  --font-display: "Outfit", sans-serif;

  --color-primary:       #0b1120;
  --color-primary-light: #1e293b;
  --color-accent:        #06b6d4;
  --color-accent-teal:   #14b8a6;

  --animate-gradient: gradient 8s linear infinite;
}

@keyframes gradient { 0% { background-position: 0% } 50% { background-position: 100% } 100% { background-position: 0% } }
@keyframes shimmer  { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }
@keyframes shine    { 0% { opacity: 0; left: -100% } 20% { opacity: .5 } 100% { opacity: 0; left: 100% } }

html, body { scroll-behavior: smooth }

::-webkit-scrollbar        { width: 6px; height: 6px }
::-webkit-scrollbar-track  { background: transparent }
::-webkit-scrollbar-thumb  { background: #cbd5e1; border-radius: 10px }
::-webkit-scrollbar-thumb:hover { background: #94a3b8 }
* { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent }

.no-scrollbar::-webkit-scrollbar { display: none }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none }

.animate-shimmer { position: relative; overflow: hidden }
.animate-shimmer::after {
  content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent);
  animation: shimmer 2s infinite;
}

.animate-shine-button { position: relative; overflow: hidden }
.animate-shine-button::after {
  content: ""; position: absolute; top: -50%; left: -100%; width: 40%; height: 200%;
  background: rgba(255,255,255,.4); transform: rotate(30deg); animation: shine 3s infinite;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important;
                           animation-iteration-count: 1 !important;
                           transition-duration: .01ms !important;
                           scroll-behavior: auto !important }
}
```

### 19.2 Class recipes — the fifteen you will reuse constantly

```
SECTION       py-32 bg-white relative overflow-hidden border-t border-slate-100
CONTAINER     max-w-7xl mx-auto px-6 relative z-10
ORB           absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5
              blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2
HEADER        text-left mb-16 max-w-2xl
BADGE         inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white
              border border-slate-200 shadow-sm mb-6
H2            text-4xl md:text-5xl lg:text-6xl font-display text-slate-900
              font-medium tracking-tight leading-tight
GRADIENT      text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent
INTRO         text-slate-500 mt-6 text-lg
GRID          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
BENTO         grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:auto-rows-[300px]
CARD          bg-white rounded-3xl p-8 border border-slate-100
              shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500
              hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]
GLASS         bg-white/60 backdrop-blur-xl border border-slate-200/80
              shadow-xl shadow-slate-200/40 rounded-3xl p-8
ICONTILE      w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm
              transition-transform duration-500 group-hover:scale-110
BTN-PRIMARY   inline-flex h-14 items-center justify-center px-10 text-lg rounded-full
              font-medium bg-primary text-white hover:bg-primary/90
              shadow-xl shadow-primary/25 hover:shadow-primary/40
              transition-all duration-300 active:scale-95
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
BTN-GHOST     inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200
              text-slate-700 font-semibold font-display
              hover:border-primary hover:text-primary hover:bg-slate-50 transition-all
```

### 19.3 Re-skinning checklist

- [ ] Set `--color-primary` (very dark, low chroma) and `--color-accent` (bright, cool, saturated).
- [ ] Pick a geometric display font; keep Inter or an equivalent neutral for body.
- [ ] Assign one hue from §2.3 to each content category; reuse it everywhere that category appears.
- [ ] Keep the neutral ramp as-is — it is doing most of the work.
- [ ] Keep every radius, shadow, spacing, and motion value unchanged.
- [ ] Write entirely original copy, imagery, and iconography.

---

## Appendix — Audit Method

Reproduce or extend this analysis:

```bash
npm install -D playwright && npx playwright install chromium
```

1. **CSS bundle** — fetch the built stylesheet, prettify, read the `@theme` block for
   design tokens, then enumerate `@keyframes`, custom utilities, and `@media` breakpoints.
2. **Rendered DOM** — `page.$$eval('section', …)` per route to capture the utility-class
   strings, which are self-documenting for a Tailwind site.
3. **Interaction states** — read `element.className` before and after
   `window.scrollTo()` / `.hover()` to diff sticky-header and dropdown states.
4. **Colour resolution** — paint each `--color-*` token onto a 1×1 canvas and read the
   pixel back to convert `oklch` → hex reliably.
5. **Motion vocabulary** — regex the JS bundle for `initial:{…}`, `transition:{…}`,
   and `viewport:{…}` and rank by frequency to recover the real animation defaults.
6. **Visual verification** — full-page screenshots at 1440px and 390px, plus the open
   mobile menu, to confirm the structural findings.
