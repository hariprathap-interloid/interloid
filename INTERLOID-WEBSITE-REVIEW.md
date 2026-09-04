# Interloid Website — Current-State Review & Redesign Reference

**Site audited:** https://www.interloid.com/
**Audit date:** 2026-09-05
**Method:** Playwright (Chromium) — DOM extraction, computed styles, multi-breakpoint
screenshots, link-integrity crawl, form-behaviour testing, performance & a11y probes.
**Companion document:** [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) — the target design language.

> **Purpose of this file.** A durable snapshot of the website as it existed on the audit
> date, plus the analysis behind the redesign. Written so that no future contributor needs
> to re-run Playwright to understand what the old site was, what was wrong with it, and why
> each decision was made.

---

## 0. Executive Summary

Interloid's site is **technically competent and strategically weak**. The engineering is
genuinely good — Next.js on Vercel, FCP 364ms, no layout overflow at any breakpoint,
`prefers-reduced-motion` honoured, every image has alt text. That is a better technical
baseline than most agency sites.

The problem is that **the site asks a prospect to trust it while providing nothing to
trust**. There is not one client name, one project, one testimonial, one screenshot of
shipped work, or one team member anywhere on the site. Meanwhile the copy makes a dozen
specific quantitative claims ("reduce dev costs by 40%", "99.99% uptime SLA", "SOC 2,
HIPAA-compliant") and a footer advertises Case Studies, Blog, Leadership Team, Careers and
five Industries — **all of which are dead links that reload the homepage**.

That gap is the single biggest conversion problem. A prospect who clicks "Case Studies"
and lands back at the top of the homepage does not conclude "the site has a bug." They
conclude "there are no case studies," and by extension, "there may be no clients."

**Severity ranking:**

| Rank | Issue | Impact |
| --- | --- | --- |
| 1 | 20 fake/dead footer links promising content that doesn't exist | Trust collapse |
| 2 | Zero proof of any kind (no clients, work, testimonials, team) | Cannot convert |
| 3 | `/privacy-policy` is a 404 while the form demands consent to it | Legal exposure |
| 4 | Unverifiable metrics + compliance claims stated as fact | Credibility risk |
| 5 | "Based in US & UK" in meta vs. sole India address on page | Authenticity risk |
| 6 | No web font loaded — renders in OS system font | Zero brand identity |
| 7 | Thin IA: 4 homepage sections, 1 orphaned page | No depth to explore |
| 8 | Generic positioning — everything for everyone | No reason to pick them |

**The good news:** the bones are sound. The service copy is already outcome-shaped, the
process section is genuinely strong, the colour ramp already matches the target design
system, and performance is excellent. This is a **content and credibility** rebuild
carrying a **visual-language upgrade** — not a rewrite from zero.

---

## 1. Current Website Structure

### 1.1 Technical profile

| Property | Value |
| --- | --- |
| Framework | Next.js (App Router, Turbopack build) |
| Hosting | Vercel |
| Styling | Tailwind CSS v4 (`oklab`/`oklch` values present) |
| Fonts | **None loaded** — resolves to `-apple-system` (OS default) |
| Analytics | Vercel Analytics + Speed Insights scripts present but **both 404** |
| Total pages | **3** (1 live content page, 1 secondary page, 1 broken) |
| Homepage height | 5,351px desktop · ~8,789px CSS mobile |
| Requests | 37 · 1 CSS · 14 JS · 13 images |

### 1.2 Page inventory

| URL | Status | Notes |
| --- | --- | --- |
| `/` | 200 | Single-page site: hero + services + technologies + contact |
| `/why-choose-us` | 200 | **Orphaned** — not in nav, only reachable via hero secondary button. No `<h1>`. |
| `/privacy-policy` | **404** | Linked from footer *and* from the contact-form consent checkbox |
| `/about` | 404 | Advertised in footer |
| Everything else in footer | — | Resolves to `/` or `/#services` |

### 1.3 Navigation

**Header** (`sticky top-0 h-16 bg-white border-b border-slate-200 shadow-sm`):
`Services` · `Technologies` · `Contact` · **`Let's Talk`** (button)

- Only **3** nav items, all anchors to the same page.
- No visual change on scroll — identical classes and computed styles at top and at 900px.
- `/why-choose-us` — the page carrying most of the persuasive content — **is not in the nav at all**.

**Footer:** 4 columns (Services / Industries / Company / Resources) + HQ block + social icons.

---

## 2. Major Sections & Their Purpose

### 2.1 Homepage

| # | Section | ID | Height | Intended purpose | Actually achieves |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | `#hero` | 836px | Position + capture | Positions vaguely; CTA is clear |
| 2 | Services | `#services` | 1,184px | Explain offerings | Explains, but 6 undifferentiated blocks |
| 3 | Technologies | `#technologies` | 1,422px | Prove competence | Logo soup; lowest value per pixel on the page |
| 4 | Contact | `#contact` | 988px | Convert | Works, but form is long and appears cold |
| 5 | Final CTA | — | ~500px | Convert again | Redundant — sits directly below the form |
| 6 | Footer | — | ~420px | Navigate + reassure | **Actively damages trust** (see §7) |

**Observation:** sections 1–4 are each set to `lg:min-h-[calc(100vh-4rem)]`, forcing every
section to fill the viewport regardless of content volume. This is why the Technologies
section occupies 1,422px to display 11 logos.

### 2.2 `/why-choose-us`

| # | Section | Purpose | Quality |
| --- | --- | --- | --- |
| 1 | 6 differentiators (zig-zag layout) | Persuade | Good copy, **broken layout** |
| 2 | "How We Work With You" — 4-step process | De-risk | **Strongest content on the site** |
| 3 | 3 stat cards (10+ / AWS / US & UK) | Prove | Weak — see §5.4 |
| 4 | Final CTA + footer | Convert | Duplicate of homepage |

---

## 3. Existing Content & Messaging (verbatim record)

Preserved so this document stands alone.

### 3.1 Hero

> **Eyebrow:** MODERN IT SOLUTIONS FOR GROWING BUSINESSES
> **H1:** Build Faster. Scale Smarter. Grow Confidently.
> **Body:** We're the development team that helps startups and growing businesses turn ideas
> into production-ready software. Quality work without the corporate overhead. Modern
> technology, agile approach, built to last.
> **CTAs:** `Get a Custom Proposal →` · `Why Choose Us`
> **Trust strip:** ✓ AWS Partner Network · ✓ US & UK Timezone Support · ✓ Transparent Pricing

**Hero carousel** — 6 auto-rotating slides ("WHY HIRE US FOR"), dot navigation, correctly
`aria-label`led. Slides: Web Development · Mobile Apps · Backend & APIs · Cloud & DevOps ·
AI Integration · Team Augmentation.

### 3.2 Services — "Full-Stack Development for Modern Businesses"

Eyebrow: COMPREHENSIVE IT SERVICES. Six cards, each = title + 1 paragraph + 3 ✓ bullets.

| Service | Headline claims |
| --- | --- |
| Web Development | Live in 30–60 days vs 6+ months · SEO-optimised, scales to millions · You own 100% of code |
| Mobile App Development | One team two platforms, **save 40%** · App store ready in weeks · Offline-first |
| Backend Development & APIs | Scales without rewrites · **Audit-ready security (SOC 2, HIPAA-compliant)** · Clean architecture |
| Cloud Infrastructure & DevOps | **Deploy 50+ times/day zero downtime** · **99.99% uptime SLA** · **Reduce ops overhead 40%** |
| AI Integration & Automation | **Reduce support tickets 60%** · Documents in seconds · Data-driven insights |
| Staff Augmentation | Senior engineers (10+ yrs) at mid-level cost · Scale in weeks · Integrates immediately |

### 3.3 Technologies — "We Don't Chase Trends—We Build on What Works"

Eyebrow: PROVEN TECHNOLOGY STACKS. Six emoji tabs (💻📱⚙️☁️🤖👥). Default panel copy:

> The modern web stack that powers billion-dollar companies. React and Next.js deliver
> lightning-fast user experiences, while TypeScript catches bugs before production.

Groups: **⚡ Frontend Frameworks** (React, Next.js, TypeScript, JavaScript, Vue.js, Angular)
· **🎨 Styling & UI** (Tailwind, Sass/SCSS, Figma) · **🔧 Build Tools** (Vite, Webpack).

### 3.4 Contact — "Let's Talk About Your Project"

> Have a project in mind? Need technical advice? We're here to help. Fill out the form
> below and we'll get back to you within 24 hours.

7 fields: First name\*, Last name\*, Company, Email\*, Phone, Service Interest (select),
Message. Consent checkbox → *privacy policy* (**404**). Submit: `Let's talk`.

### 3.5 Final CTA (repeated on both pages)

> **Let's Build Your Next Project Together**
> Whether you're launching your first product or scaling to meet demand, we provide the
> technical expertise you need—without the overhead. Get in touch to discuss your
> requirements and get a clear, honest proposal.
> `Get a Custom Proposal →` · `Talk to Our Team`

### 3.6 `/why-choose-us` differentiators

🎯 Outcome-Focused Development · 🤝 True Partnership, Not Vendor Relationship ·
⚡ Quality Without the Bloat · 🔒 You Own Everything · 💰 Transparent Pricing & Honest
Estimates · 🚀 Proven Track Record

> **Proven Track Record** — *Real products at scale, not demos.* AWS Partner Network member
> with proven experience building production systems. We've shipped real products that
> scale, not just demos or POCs.

### 3.7 Process (4 steps)

| # | Step | Timebox | Description |
| --- | --- | --- | --- |
| 1 | Discovery & Strategy | 30 mins | Free consultation; assess feasibility, timeline, budget—no pressure |
| 2 | Clear Proposal | 48 hours | Written proposal with timeline and pricing estimate |
| 3 | Collaborative Development | Weekly updates | Agile sprints with weekly demos |
| 4 | Launch & Beyond | 30-day support | 30-day post-launch support, then retainer or one-off |

### 3.8 Stat cards

📈 **10+** Years Combined Experience · ☁️ **AWS** Partner Network Member · 🌍 **US & UK** Global Coverage

### 3.9 Footer contact block

> **HQ:** No. 82/1, First Floor, Jai Marappa Complex, Sri Aishwariyam Nagar,
> Karattadipalayam, Gobichettipalayam, Tamil Nadu 638453
> **Email:** connect@interloid.com · **Phone:** +91 9042032424
> © 2026 Interloid Technologies Private Limited

Social: LinkedIn `/company/interloid-technologies` · X `http://x.com/InterloidTech`
(**insecure http://**) · YouTube `@InterloidTechnologies`

---

## 4. Content Strengths — What Is Genuinely Working

1. **Service copy is already outcome-shaped, not feature-shaped.** "Go live in 30–60 days
   instead of 6+ months" beats "we use React." The *structure* (outcome → benefit →
   timeframe) is correct and should survive the rewrite.
2. **The 4-step process is the best asset on the site.** Concrete timeboxes (30 mins,
   48 hours, weekly, 30-day) directly reduce buyer risk. It is buried on an orphaned page.
3. **"You own 100% of the code — zero vendor lock-in"** is a real, specific, verifiable
   differentiator that many agencies won't say. Lead with this.
4. **"Free 30-minute consultation, no pressure"** is a well-calibrated low-friction offer.
5. **Anti-agency positioning** ("no corporate overhead, no endless meetings, no false
   promises") is a defensible angle for the SMB/startup buyer.
6. **Voice is plain and confident** — no jargon soup. Good foundation.
7. **Headline formula works.** "Build Faster. Scale Smarter. Grow Confidently." is rhythmic
   and memorable, even if it says nothing specific yet.

---

## 5. Content Weaknesses

### 5.1 Zero proof — the defining problem

Across ~5,300px of homepage and ~4,600px of secondary page there is **not one**:

- Client name or logo
- Project, product, or case study
- Testimonial or quote
- Team member, photo, or bio
- Screenshot of shipped work
- Metric traceable to a real engagement
- Verifiable certification link

The site claims *"We've shipped real products that scale, not just demos or POCs"* — and
then shows neither products nor demos. **A claim without evidence reads worse than no
claim**, because it invites the question the site can't answer.

### 5.2 Unverifiable quantitative claims

Every number is presented as fact with no source, no client, no footnote:

`40%` dev cost saving · `40%` ops overhead reduction · `60%` fewer support tickets ·
`50+` deploys/day · `99.99%` uptime SLA · `30–60 days` to launch · `10+` years combined

**"99.99% uptime SLA"** is the most dangerous — an SLA is a *contractual guarantee* with
financial penalties. Stating it as a marketing bullet without a contract behind it is a
commitment the company may not intend to make.

### 5.3 Compliance claims stated inconsistently

| Location | Wording |
| --- | --- |
| Hero carousel | "Audit-ready security (SOC 2, **HIPAA-ready**)" |
| Services section | "Audit-ready security (SOC 2, **HIPAA-compliant**)" |

These are **legally different claims**. "HIPAA-compliant" asserts a status that requires
a BAA and formal controls; "HIPAA-ready" describes capability. The same is true of SOC 2 —
either the company holds a Type I/II report or it does not. Using both phrasings on one
site suggests neither was checked.

### 5.4 Weak or self-undermining proof points

- **"10+ Years Combined Experience"** — "combined" is a tell. A prospect reads it as "we
  are a small, young team padding the number." Either state individual seniority
  ("engineers with 8–12 years each") or drop it.
- **"AWS Partner Network Member"** — claimed 3× with no badge, tier, or link to the AWS
  Partner Finder listing. Unverified, it reads as a logo grab.
- **"US & UK Global Coverage"** — this is *timezone coverage*, but the meta description
  says **"Based in US & UK"** while the only address on the site is Tamil Nadu with a +91
  number. See §7.3.

### 5.5 Duplicated content

The hero carousel slides and the Services cards contain **verbatim identical bullets**:

> "One team, two platforms—reduce dev costs by 40%" · "App store ready in weeks, not
> quarters" · "Offline-first design keeps users engaged anytime"

…appear in both the hero *and* the Mobile App Development card. Same for Backend & APIs.
The user reads the same three lines twice within one scroll.

### 5.6 Generic, undifferentiated positioning

"Startups and growing businesses" + six services + React *and* Vue *and* Angular =
**no specialisation signal**. Nothing tells a prospect "these are the people for *my*
problem." The Technologies section actively hurts here: listing competing frameworks
signals "we'll do whatever you ask" rather than "we have a considered opinion" — which
directly contradicts the section's own headline, *"We Don't Chase Trends."*

### 5.7 Low-value content

- **Technologies section** — 1,422px (27% of the homepage) for 11 logos. Prospects do not
  choose an agency because it uses Webpack. Buyers who *do* care are technical evaluators
  who arrive later in the funnel.
- **Footer Industries/Resources columns** — pure fiction (§7.1).
- **Second CTA block** — sits immediately below the contact form. Asking again after
  they've reached the form adds nothing.

### 5.8 Missing the entire middle of the funnel

There is no answer to: *Who are you? Who have you helped? What did it cost? How long did
it take? What happens if it goes wrong? Who will I actually work with?*

---

## 6. UX / UI Observations

### 6.1 Visual hierarchy issues

1. **All six service cards carry identical visual weight** — same size, same border, same
   icon treatment, same 3-bullet structure. Nothing signals which service matters most or
   which the company is best at. The eye has no entry point.
2. **Viewport-locked sections** (`min-h-[calc(100vh-4rem)]`) create dead vertical space and
   force uniform section rhythm. Every section feels equally important, so none is.
3. **Hero carousel competes with the H1.** The rotating panel sits to the right of the
   headline and auto-advances, pulling attention away from the primary message during the
   exact seconds the visitor is reading it.
4. **Small type at low emphasis.** Service bullets render at 14px, body at 15–16px inside
   cards, against a 64px H1 — the jump is too large, and the supporting content reads as
   fine print.
5. **`/why-choose-us` zig-zag layout breaks reading order.** Items alternate
   title-left/body-right, then body-left/title-right. The eye cannot establish a pattern,
   and on several rows the description appears *before* the heading it belongs to.

### 6.2 Typography

- **No web font is loaded.** Computed `font-family` is `-apple-system` everywhere. The site
  renders in SF Pro on macOS, Segoe UI on Windows, Roboto on Android — **it literally looks
  like a different brand on every device**, and has no typographic identity at all.
- H1 64px/800, H2 40px/700, body 20px — a reasonable scale, but delivered in a system font
  it reads as an unstyled template.
- No letter-spacing adjustment on large headings (`letter-spacing: normal` at 64px), which
  makes the display type feel loose.

### 6.3 Colour & contrast

Brand palette in use:

```
#1F5DA0   primary blue      (rgb 31,93,160)
#289DBE   secondary cyan    (rgb 40,157,190)
#0F172A   slate-900  headings
#475569   slate-600  body
#64748B   slate-500  muted
#94A3B8   slate-400  subtle
#F8FAFC   slate-50   section wash
```

- **Body copy contrast is good** — `#475569` on white = **7.58:1** (passes AAA).
- **Accent `#289DBE` on white = 3.15:1 — fails WCAG AA** (needs 4.5:1) and it is used at
  15px for section eyebrows and inline emphasis. Must darken for text use.
- Overall the page is **washed out** — pale blue radial gradients on near-white backgrounds
  produce very low overall contrast and a "faded" impression at a glance.

### 6.4 Iconography

Emoji are used as primary iconography throughout: 💻📱⚙️☁️🤖👥 (tech tabs), ⚡🎨🔧
(tech groups), 🎯🤝⚡🔒💰🚀 (differentiators), 📈☁️🌍 (stats), 📝 (process).

Emoji render inconsistently across platforms, cannot be recoloured, don't scale cleanly,
carry a casual register, and read as placeholder work. For a B2B technology vendor selling
"enterprise-grade," this is the most visible signal of unpolish on the site.

### 6.5 Component & shape language

| Property | Current | Target (DESIGN-SYSTEM.md) |
| --- | --- | --- |
| Card radius | 8–22px | `rounded-3xl` (24px) → `rounded-[2.5rem]` |
| Button radius | **10px** | **`rounded-full`** |
| Button height | 50px | `h-14` (56px) |
| Shadows | Mostly flat / `shadow-sm` | Wide, soft, tinted (`0_20px_40px_-12px`) |
| Nav | Static white bar, no scroll state | Morphing transparent → glass pill |
| Icons | Emoji | Lucide, 24×24, `currentColor` |
| Headline treatment | Solid colour | Two-tone: neutral + gradient clause |

### 6.6 What is done well

- **Performance is genuinely strong:** TTFB 55ms · FCP 364ms · DOM interactive 111ms ·
  networkidle 1.85s · only 37 requests. Do not regress this.
- **No horizontal overflow at any tested width** (1440 / 1280 / 768 / 390 / 360).
- **`prefers-reduced-motion` is respected** — 0 elements animate when the user opts out.
  This is rarely done well; preserve it.
- **All 13 images have `alt` text.**
- **Correct landmarks** — one `<main>`, one `<nav>`, one `<footer>`, exactly one `<h1>` on
  the homepage.
- **Carousel dots are properly `aria-label`led** ("Go to Mobile Apps").
- **Form validation works** and returns clear per-field messages.

### 6.7 Accessibility defects found

| Issue | Detail |
| --- | --- |
| `/why-choose-us` has **no `<h1>`** | Document starts at `<h2>` |
| Service-interest `<select>` has no `name`, `id`, or label | Not programmatically labelled; may not submit |
| Required fields lack the `required` attribute | Visually marked `*`, but AT users aren't told |
| One `<button>` has no accessible name | Fails 4.1.2 |
| Accent text 3.15:1 | Fails 1.4.3 Contrast (Minimum) |
| 3 footer links `href="#"` | Privacy / Terms / Cookies go nowhere |

---

## 7. Trust & Credibility Elements

### 7.1 The footer is the single most damaging element on the site

Twenty links advertise content that does not exist. **Every one resolves to the homepage
or the wrong anchor.**

| Column | Links | Actual destination | Reality |
| --- | --- | --- | --- |
| **SERVICES** | Cloud Infrastructure · Security & Compliance · DevOps Engineering · Data Solutions · AI & Machine Learning | all → `/#services` | **Names don't match the 6 real services.** "Security & Compliance" and "Data Solutions" are not offered anywhere on the site. |
| **INDUSTRIES** | Financial Services · Healthcare · Retail & E-commerce · Manufacturing · Technology | all → `/` | No industry content exists |
| **COMPANY** | About Interloid · Leadership Team · Careers · Partners | all → `/` | None exist |
| **RESOURCES** | Documentation · Case Studies · Blog & Insights · Webinars · Support Center | all → `/` | None exist |
| **Legal** | Privacy · Terms · Cookies | all → `#` | Plus `/privacy-policy` = **404** |

A prospect evaluating vendors will click "Case Studies" first. Being returned to the top of
the homepage is interpreted as concealment, not as a broken link.

### 7.2 Legal exposure

The contact form displays *"By selecting this, you agree to our privacy policy"* and links
to **`/privacy-policy`, which returns 404**. The site collects name, email, phone, company
and free-text message. Collecting personal data while linking to a non-existent privacy
policy is a GDPR/DPDP Act problem, not a UX nitpick. **Fix before anything else.**

### 7.3 Geographic inconsistency

| Source | Claim |
| --- | --- |
| `<meta name="description">` | "**Based in US & UK**" |
| Hero trust strip | "US & UK Timezone Support" |
| Stat card | "US & UK — Global Coverage — Timezone support across markets" |
| Footer HQ (only address) | Gobichettipalayam, **Tamil Nadu, India** |
| Phone (only number) | **+91** 9042032424 |
| Legal entity | Interloid Technologies **Private Limited** (Indian entity type) |

The meta description asserts a US/UK base the rest of the site contradicts. Whether this is
sloppy copy or intentional, a prospect who notices will discount everything else on the
page. **Reconcile this deliberately** — either document real US/UK presence, or reframe
honestly as "India-based, working US & UK hours," which is a perfectly strong position.

### 7.4 Production placeholders shipped live

```html
<meta name="google-site-verification" content="your-google-verification-code">
<meta name="yandex-verification"      content="your-yandex-verification-code">
```

Visible in view-source. Also: both Vercel analytics scripts return **404**, so **no
analytics are being collected at all** — there is currently no data on how the site performs.

### 7.5 Other credibility gaps

- `http://x.com/InterloidTech` — insecure scheme on an outbound brand link.
- `og:image` → `/og-image.jpg` (unverified; if missing, every social share renders blank).
- No company registration number, founding year, team size, or office photo.
- No security/compliance page despite SOC 2 and HIPAA claims.

---

## 8. CTA & Conversion-Flow Observations

### 8.1 Current CTA inventory

| Location | Label | Destination |
| --- | --- | --- |
| Header | Let's Talk | `/#contact` |
| Hero primary | Get a Custom Proposal → | `/#contact` |
| Hero secondary | Why Choose Us | `/why-choose-us` |
| Contact form | Let's talk | submit |
| Final CTA ×2 | Get a Custom Proposal → · Talk to Our Team | both `/#contact` |

### 8.2 Problems

1. **One destination, many labels.** Five of six CTAs land on the same form. "Get a Custom
   Proposal," "Talk to Our Team," and "Let's Talk" imply three different commitment levels
   but deliver one identical outcome. This erodes trust in the labelling.
2. **No low-commitment path.** Every CTA is "contact us." There is no "see our work," "read
   a case study," "download a pricing guide," or "book a call" — nothing for the ~95% of
   visitors not ready to talk on visit one.
3. **The best offer is hidden.** "Free 30-minute consultation, no pressure" appears only in
   step 1 of the process, on the orphaned page. It is a far stronger CTA than "Get a Custom
   Proposal" and should be the primary button site-wide.
4. **Redundant terminal CTA.** The final CTA block sits *below* the contact form. A visitor
   who scrolled past the form isn't converted by being asked again 300px later.
5. **Form friction.** 7 fields (3 required) presented cold, with no reassurance beside it —
   no response-time guarantee at the point of submission, no "no sales pressure" note, no
   alternative (calendar link), no indication of what happens next.
6. **No calendar booking.** For a service business selling a "free 30-minute consultation,"
   the absence of direct scheduling (Calendly/Cal.com) is a significant conversion leak.

---

## 9. Disposition — Keep / Rewrite / Remove / Add

### 9.1 KEEP (carry forward largely as-is)

| Item | Why |
| --- | --- |
| 4-step process with timeboxes | Best content on the site — **promote to homepage** |
| "You own 100% of the code — zero vendor lock-in" | Real, verifiable differentiator |
| "Free 30-minute consultation, no pressure" | Strong low-friction offer — **make it the primary CTA** |
| Outcome-first service copy *structure* | Correct pattern; only the claims need sourcing |
| Anti-agency positioning angle | Defensible for the SMB/startup buyer |
| Slate colour ramp (`#0F172A`/`#475569`/`#64748B`) | Already matches DESIGN-SYSTEM.md §2.2 |
| Performance budget (FCP <400ms, ~37 requests) | Excellent — treat as a regression gate |
| `prefers-reduced-motion` handling | Rare and correct |
| Alt text discipline · landmarks · aria-labelled carousel | Keep the standard |
| H1 formula "Build Faster. Scale Smarter. Grow Confidently." | Memorable — keep as a supporting line if the new H1 is more specific |

### 9.2 REWRITE

| Item | Direction |
| --- | --- |
| Hero H1 + subhead | Add specificity: who it's for, what outcome, what proof. Replace the generic "startups and growing businesses." |
| All quantitative claims | Either attach a source ("40% saving on the *[Client]* rebuild") or convert to qualitative language. Remove any number you cannot defend in a sales call. |
| "99.99% uptime SLA" | Remove or restate as "architected for 99.9%+ availability" unless a contractual SLA genuinely exists. |
| SOC 2 / HIPAA wording | Pick one truthful phrasing and use it everywhere. Prefer "HIPAA-ready architecture" / "SOC 2-aligned controls" unless certified. |
| "10+ Years Combined Experience" | Reframe to individual seniority, or replace with a stronger stat (projects shipped, users served, uptime maintained). |
| Meta description "Based in US & UK" | Reconcile with reality (§7.3). |
| Footer service names | Must match the 6 services actually offered. |
| `/why-choose-us` differentiators | Good copy, wrong container — rebuild as a proper grid, add an `<h1>`. |
| Technologies section framing | From "here are logos" to "here's what we chose and why." Cut Vue/Angular unless genuinely core. |
| CTA labels | Differentiate by commitment level, or unify to one honest label. |

### 9.3 REMOVE

| Item | Reason |
| --- | --- |
| **All 20 dead footer links** | Fabricated navigation. Remove the Industries/Resources columns entirely until content exists. |
| Duplicate hero-carousel bullets | Verbatim repeats of the Services cards |
| Second CTA block below the form | Redundant |
| All emoji used as icons | Replace with Lucide (DESIGN-SYSTEM.md §3.1) |
| Placeholder verification meta tags | Shipped-template debris |
| Broken Vercel analytics scripts | Either enable properly or remove |
| `min-h-screen` on content sections | Let content determine height |
| Vue.js / Angular logos | Dilutes the "we have an opinion" positioning |
| Auto-rotating hero carousel | Competes with the H1; replace with static proof or a product visual |

### 9.4 ADD (highest conversion impact first)

| Priority | Addition | Why |
| --- | --- | --- |
| **P0** | **Working `/privacy-policy` + `/terms`** | Legal requirement; form currently references a 404 |
| **P0** | **3–6 case studies** (problem → approach → outcome → stack) | The #1 missing asset |
| **P0** | **Fix or delete every dead link** | Trust |
| **P1** | Client logos or "trusted by" strip | Instant credibility |
| **P1** | 2–4 testimonials with name, role, company, photo | Social proof |
| **P1** | **About / Team page** with real faces and bios | "Who will I work with?" |
| **P1** | Pricing guidance (ranges, engagement models) | #1 unanswered buyer question |
| **P2** | Calendar booking (Cal.com/Calendly) | Removes friction from the free consult |
| **P2** | Industry or use-case pages | Specialisation signal; SEO surface |
| **P2** | FAQ (timelines, ownership, communication, post-launch) | Handles objections |
| **P2** | AWS Partner Finder verification link + badge | Makes the claim checkable |
| **P3** | Blog / insights | Long-tail SEO and expertise demonstration |
| **P3** | Careers page | Recruiting + signals a real growing company |
| **P3** | Real `og-image.jpg` | Social sharing |

### 9.5 Portfolio / case-study opportunities

Even without named clients (NDAs are common), proof can be built:

- **Anonymised case studies** — "A UK fintech reduced onboarding from 6 days to 4 hours."
  Sector + scale + outcome + stack, no client name required.
- **Before/after metrics** — load time, deploy frequency, error rate, cost per transaction.
  This is where the existing 40%/60% numbers *should* live, attached to real work.
- **Architecture teardowns** — a diagram of a system built, annotated with the decisions.
  Demonstrates thinking, which is what technical buyers actually evaluate.
- **Internal products / open source** — anything shipped under the Interloid name.
- **"How we'd approach it" walkthroughs** — a worked example for a common brief. Proves
  competence with zero client permission needed.
- **Screenshots / short demo video** — even one product screenshot outperforms all six
  current service cards for credibility.

---

## 10. Recommended Information Architecture

### 10.1 Target structure

```
/                        Homepage (proof-led)
/services                Services overview
  /services/web-development
  /services/mobile-apps
  /services/backend-apis
  /services/cloud-devops
  /services/ai-automation
  /services/staff-augmentation
/work                    Case studies index          ← NEW, critical
  /work/[case-study]     Individual case study
/about                   Story, team, values         ← NEW
/process                 How we work (promote from why-choose-us)
/pricing                 Engagement models & ranges  ← NEW
/contact                 Form + calendar booking
/blog                    Insights                    ← later
/careers                 Roles                       ← later
/privacy-policy          ← FIX (currently 404)
/terms-of-service        ← NEW
```

### 10.2 Header navigation

`Services ▾` · `Work` · `About` · `Process` · `Contact` + **`Book a Free Consult`** (primary)

Fold `/why-choose-us` into `/about` and `/process`. Never ship a nav item without a page.

### 10.3 Footer

**Only link to pages that exist.** Start with three columns and grow:

```
Services (the 6 real ones)  |  Company (About · Work · Process · Careers · Contact)  |  Legal (Privacy · Terms)
+ HQ block · verified AWS Partner badge · social links (https:// only)
```

---

## 11. Recommended Homepage Structure

Applying DESIGN-SYSTEM.md §5.3, reordered so **proof arrives before the ask**:

| # | Section | Background | Purpose | Design-system pattern |
| --- | --- | --- | --- | --- |
| 1 | **Hero** — specific H1, two-tone gradient, real trust strip | `slate-50` | Position | §7.2 centred hero + orbs |
| 2 | **Social proof strip** — client logos / "trusted by" | white | Instant credibility | §8.10 marquee |
| 3 | **Services** — 6, with one visually dominant | white | Explain | §5.2-C split showcase or §5.2-D bento |
| 4 | **Featured case study** — one, told properly | `slate-50` | **Prove** | §8.4 feature panel |
| 5 | **Process** — 4 steps with timeboxes | white | De-risk | §8.9 process timeline |
| 6 | **Why Interloid** — differentiators | `slate-50` | Persuade | §8.2 glass bento |
| 7 | **Testimonials** — 2–3 with faces | white | Social proof | §8.3 card grid |
| 8 | **Tech stack** — condensed, opinionated | white, `border-y` | Competence | §8.10 marquee (**not** a full section**)** |
| 9 | **FAQ** — 5–6 objection handlers | `slate-50` | Remove doubt | accordion |
| 10 | **CTA** — dark slab, free consult + calendar | white → `slate-900` | Convert | §11.1 dark CTA |
| 11 | **Footer** — real links only | `slate-950` | Navigate | §11.2 |

**Key changes vs. today:** proof (2, 4, 7) inserted before the ask · Technologies demoted
from a 1,422px section to a band · Process promoted from an orphaned page · FAQ added ·
one terminal CTA instead of two.

---

## 12. Design-System Considerations

Mapping the current site onto [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md):

### 12.1 Direct carry-over (no change needed)

- Slate neutral ramp — already identical (§2.2)
- Tailwind v4 — same engine, `@theme` tokens drop straight in
- `prefers-reduced-motion` handling (§18.5)
- Performance discipline

### 12.2 Token mapping

```css
@theme {
  /* Keep Interloid's brand blue as primary-dark, or adopt the darker navy: */
  --color-primary:       #0b1120;   /* or deepen #1F5DA0 for a navier anchor */
  --color-primary-light: #1e293b;
  --color-accent:        #289DBE;   /* ⚠ darken to ≥#1B7C99 for text use — see §6.3 */
  --color-accent-teal:   #14b8a6;

  --font-display: "Outfit", sans-serif;   /* ← MUST ADD, none loaded today */
  --font-sans:    "Inter",  sans-serif;   /* ← MUST ADD */
}
```

> **Contrast note.** `#289DBE` at 3.15:1 fails WCAG AA. Keep it for large gradient
> headlines, icons and borders; use a darkened variant (≈`#1B7C99`, ~4.6:1) anywhere it
> appears as body-size text.

### 12.3 Required changes

| Area | From | To |
| --- | --- | --- |
| **Fonts** | `-apple-system` (none loaded) | Outfit (display) + Inter (body) — **highest-visibility single fix** |
| **Nav** | Static white bar | Morphing transparent → glass pill (§6.1) |
| **Buttons** | `border-radius: 10px`, 50px tall | `rounded-full`, `h-14`, `active:scale-95` (§9) |
| **Cards** | 8–22px radius, flat | `rounded-3xl`+, wide soft tinted shadows (§8, §15) |
| **Icons** | Emoji | Lucide 24×24 (§3.1) |
| **Headlines** | Solid colour | Two-tone neutral + gradient clause (§2.4-A) |
| **Section bg** | Uniform pale washes | Alternating white / `slate-50` + hairlines (§16.2) |
| **Depth** | Flat | Ambient blurred orbs (§2.5) |
| **Motion** | `fadeInUp`, `float`, `bounce` | `whileInView` `{opacity:0,y:20}`, `once:true`, staggered (§13.1) |
| **CTA close** | Light section, duplicated | Single dark `rounded-[3rem]` slab (§11.1) |
| **Section height** | `min-h-screen` forced | `py-24`/`py-32`, content-driven (§16.1) |

### 12.4 Guard against regression

The design system is heavier than the current site — blurred orbs, backdrop-blur glass,
web fonts and motion all cost something. **Budget it:**

- Self-host or `display=swap` the fonts; subset to Latin.
- Cap ambient orbs at ~3 per section; they are cheap (`filter: blur`) but compound.
- Keep FCP under ~600ms and total requests under ~50.
- Preserve the reduced-motion block verbatim.

---

## 13. Redesign QA Checklist

Run against the rebuilt site before launch.

### Content & trust
- [ ] Every nav and footer link resolves to a real page (zero `href="#"`, zero `→ /`)
- [ ] `/privacy-policy` and `/terms-of-service` exist and are linked from the form
- [ ] At least 3 case studies published, each with a measurable outcome
- [ ] At least 2 testimonials with name, role, company
- [ ] Team/About page with real names and photos
- [ ] Every numeric claim is either sourced or removed
- [ ] SOC 2 / HIPAA wording is consistent and legally accurate site-wide
- [ ] Geographic claims reconciled (meta, hero, stats, footer all agree)
- [ ] AWS Partner claim links to a verifiable listing
- [ ] Footer service names match the services actually offered
- [ ] No duplicated copy blocks between sections

### Technical
- [ ] Placeholder meta verification tags removed or filled with real values
- [ ] Analytics loading successfully (no 404s in console)
- [ ] Console clean — zero errors
- [ ] All outbound links use `https://`
- [ ] `og-image.jpg` exists and renders in a share preview
- [ ] Sitemap + `robots.txt` present
- [ ] FCP < 600ms, TTFB < 200ms, requests < 50
- [ ] Fonts self-hosted or `display=swap`; no FOIT

### Accessibility
- [ ] Exactly one `<h1>` per page — **including `/why-choose-us`'s successor**
- [ ] Heading order never skips a level
- [ ] All form fields have `<label for>`; `required` set on required fields
- [ ] The service `<select>` has `name`, `id`, and a label
- [ ] Every button and link has an accessible name
- [ ] All text ≥ 4.5:1 contrast (verify the accent specifically)
- [ ] Visible `focus-visible` ring on every interactive element
- [ ] `prefers-reduced-motion` disables all loops and reveals
- [ ] Full keyboard traversal of nav, carousel, form
- [ ] All images have meaningful `alt`

### Responsive (test 1440 / 1280 / 1024 / 768 / 390 / 360)
- [ ] `scrollWidth === clientWidth` at every breakpoint
- [ ] No section forced to `min-h-screen`
- [ ] Tab strips / carousels don't clip on mobile
- [ ] Tap targets ≥ 44×44px
- [ ] Mobile page height reduced from the ~8,800px baseline

### Design system conformance
- [ ] Outfit + Inter loading (no `-apple-system` in computed styles)
- [ ] All buttons `rounded-full`, `h-14`, with `active:scale-95`
- [ ] Cards `rounded-3xl` or larger
- [ ] Zero emoji used as iconography
- [ ] Every section H2 uses the two-tone gradient treatment exactly once
- [ ] Shadows are wide, soft, tinted (alpha ≤ 0.1)
- [ ] Sections alternate white / `slate-50` with hairline borders
- [ ] Ambient orbs present, `pointer-events-none`, behind `z-10` content
- [ ] Reveals use `{opacity:0,y:20}` + `viewport={{once:true}}` + stagger
- [ ] Nav morphs on scroll
- [ ] Exactly one dark CTA slab + dark footer per page

### Conversion
- [ ] Primary CTA is the free 30-minute consult, consistent site-wide
- [ ] Calendar booking available as an alternative to the form
- [ ] Contact form ≤ 4 required fields
- [ ] Response-time promise visible at the point of submission
- [ ] A low-commitment path exists (view work / read case study)
- [ ] Only one terminal CTA block per page

---

## 14. Findings To Preserve

Reference values from the audit, so the rebuild can be compared against the baseline.

### 14.1 Performance baseline (do not regress)

```
TTFB              55 ms
FCP              364 ms
DOM interactive  111 ms
DOM complete     462 ms
networkidle    1,850 ms
Requests            37  (1 doc · 1 css · 14 js · 13 img · 8 fetch)
```

### 14.2 Page dimensions (baseline)

```
Homepage desktop @1440   5,351 px
Homepage mobile  @390   ~8,789 px CSS
/why-choose-us   @1440   4,640 px
Section heights: hero 836 · services 1,184 · technologies 1,422 · contact 988
```

### 14.3 Colour tokens in use

```
#1F5DA0  primary blue        rgb(31,93,160)
#289DBE  secondary cyan      rgb(40,157,190)   ← 3.15:1 on white, fails AA for text
#0F172A  slate-900  headings
#475569  slate-600  body     ← 7.58:1, passes AAA
#64748B  slate-500  muted
#94A3B8  slate-400  subtle
#F8FAFC  slate-50   wash
Gradients: radial rgba(31,93,160,0.1) / rgba(40,157,190,0.1)
```

### 14.4 Type & shape

```
H1        64px / 800 / lh 70.4px / ls normal
H2        40px / 700
Body      20px / lh 32.5px
Bullets   14px
Font      -apple-system  (NO web font loaded)
Radii     8, 10, 14, 18, 20, 22px, + full
Button    10px radius · 50px tall · shadow rgba(31,93,160,0.2) 0 10px 15px -3px
```

### 14.5 Animations present

```
float 20s        ambient background shapes
bounce 2s        scroll indicator
fadeInUp 0.6s    section entrances
fadeInScale 0.4s card entrances
Hero carousel: 6 slides, auto-rotating (~5s), dot nav, aria-labelled
prefers-reduced-motion: reduce → 0 animating elements ✓
```

### 14.6 Things that will be easy to forget

1. **`/privacy-policy` 404s while the form demands consent to it.** Fix first.
2. **Both Vercel analytics scripts 404** — there is no historical traffic data. Any
   "before/after" comparison must start from the relaunch.
3. **The footer's 4 columns are aspirational, not real** — do not port them forward.
4. **Footer SERVICES names ≠ actual services.** Someone will copy the old footer; don't.
5. **`/why-choose-us` has no `<h1>`** and is not in the nav.
6. **Hero and Services share verbatim bullet copy** — deduplicate during the rewrite.
7. **"HIPAA-ready" vs "HIPAA-compliant"** appear on the same site. Legal decision required.
8. **`http://x.com/...`** — insecure scheme.
9. **The site has never had a web font.** Adding Outfit + Inter will be the single most
   visible change; budget for the load.
10. **"Free 30-minute consultation"** is the strongest offer on the site and is currently
    buried in step 1 of a process section on an orphaned page.

---

## 15. Suggested Sequencing

| Phase | Scope | Rationale |
| --- | --- | --- |
| **0 — Stop the bleeding** *(days)* | Publish privacy policy & terms · remove/fix all dead footer links · remove placeholder meta · fix analytics · `https://` on socials · reconcile geography claims | Legal + trust; independent of any redesign |
| **1 — Content** *(weeks)* | Write 3 case studies · collect 2–3 testimonials · About/team page · source or strip every metric · settle compliance wording | Content is the bottleneck; start it in parallel with design |
| **2 — Design system** *(weeks)* | Load Outfit + Inter · token layer · rebuild Button/Card/Badge/Nav/Section per DESIGN-SYSTEM.md · replace emoji with Lucide | Establishes the visual language |
| **3 — Rebuild** | New homepage per §11 · service detail pages · `/work` · `/about` · `/process` · `/pricing` | Assemble content into the new IA |
| **4 — Conversion** | Calendar booking · shorten form · FAQ · differentiated CTAs | Optimise once there's traffic to optimise |
| **5 — Verify** | Run §13 checklist at all breakpoints; re-audit with Playwright | Confirm no regressions |

---

## 16. Audit Method (to reproduce)

```bash
npm install -D playwright && npx playwright install chromium
```

1. **Structure** — `page.$$eval('section', …)` for IDs, classes, heights, heading outlines.
2. **Content** — `document.body.innerText` per route, saved verbatim.
3. **Links** — enumerate every `<a>` with its resolved `href`; compare label vs destination.
4. **Design tokens** — walk all elements collecting `borderRadius`, `boxShadow`,
   `fontFamily`, `color`, `backgroundColor` into Sets.
5. **Contrast** — compute WCAG relative luminance from `getComputedStyle` foreground and
   nearest opaque ancestor background.
6. **Responsive** — screenshot at 1440/1280/768/390/360; assert
   `documentElement.scrollWidth === clientWidth`.
7. **Performance** — `performance.getEntriesByType('navigation')` + `first-contentful-paint`.
8. **A11y** — h1 count, alt coverage, label association, landmark count, `href="#"` scan.
9. **Motion** — collect non-`none` `animationName`; re-run context with
   `reducedMotion: 'reduce'` and assert zero.
10. **Forms** — submit empty, capture `[role=alert]` messages.
