# Handoff: Eliyah Acoustic Homepage

## Overview
Marketing homepage for **Eliyah Acoustic** — a studio that designs, hand-builds and tunes custom architectural sound systems (projects ₪70,000 – ₪400,000+). The page is a commissioned-work narrative, not e-commerce: the only CTAs are "Request a Consultation" / "Begin a System". Content is bilingual (English default, Hebrew via a nav toggle) and follows the brand doc's own section order.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing intended look, copy and behaviour. They are **not** production code to copy directly. The task is to **recreate this design in the target codebase's existing environment** (Next.js/React, Astro, Vue, WordPress, etc.) using its established patterns, i18n solution and component library. If no codebase exists yet, pick the most appropriate framework — a static-first stack (Next.js App Router or Astro) suits this page: it is content-driven, image-heavy, needs SSR-friendly i18n and no application state.

`Eliyah Acoustic Homepage.dc.html` is authored in a custom "Design Component" runtime (a template + a logic class, mounted by `support.js`). Read it for markup, exact inline styles and the full bilingual copy dictionary — do not try to port the runtime itself.

## Fidelity
**High-fidelity.** Final palette, typography, spacing, imagery, copy and scroll behaviour. Recreate pixel-faithfully with the codebase's own styling layer (CSS modules / Tailwind / styled-components are all fine — the values below are what matter).

## Design Tokens

### Colour
| Token | Hex | Use |
|---|---|---|
| Void Oak | `#181310` | Primary background (warm near-black, never pure black) |
| Card / raised | `#201914` | Image-frame background behind photos while loading |
| Travertine | `#E9E2D3` | Primary text on dark; background of the light "About" section |
| Travertine dim | `#D8D0BE` | Image-frame background inside the light section |
| Walnut | `#6B4E36` | Labels/rules inside the light section |
| Aubergine | `#3A2142` | Hover wash + `::selection` only — never a flat background |
| Aged Brass | `#B8935F` | Eyebrow labels, step numbers, CTA underline, one accent line per band |
| Smoke | `#A39880` | Wordmark sub-lockup, muted meta |

Text alphas on dark: headings `#E9E2D3`; body `rgba(233,226,211,0.72)`; step body `rgba(233,226,211,0.68)`; cell text `rgba(233,226,211,0.82–0.86)`.
Text alphas on light: body `rgba(24,19,16,0.78)`; caption `rgba(24,19,16,0.60–0.62)`.
Hairlines: `rgba(233,226,211,0.10–0.14)` on dark, `rgba(24,19,16,0.16)` on light.

### Typography
- **Display (EN):** Fraunces, weight 200 (300 for step titles / team names). Google Fonts axes `opsz,wght@9..144,200;300;400`.
- **Body & UI (EN):** Manrope, 300 body / 500–600 labels.
- **Hebrew (both roles):** Heebo, 200 display / 300 body. Fraunces and Manrope have no Hebrew coverage — swapping the family is required, not cosmetic.
- Section eyebrow label: 10px, weight 600, `letter-spacing:0.28em`, uppercase, brass. Hebrew variant: 11px, weight 500, `0.24em`, no uppercase.
- Body: 15px / line-height 1.95 (EN), 2.05 (HE) — exposed as `--lh`.
- Headings use `clamp()`; see per-section list below. Hebrew heads run ~15% smaller with looser line-height (1.4–1.45) because Heebo has a taller x-height.
- Nav links 11px/600/`0.14em`/uppercase. Wordmark: "ELIYAH" Fraunces 200, `letter-spacing:0.14em`; "ACOUSTIC" Manrope 400, `letter-spacing:0.58em`.

### Spacing & layout
- Section vertical rhythm: `clamp(84–90px, 11–13vw, 150–180px)`; horizontal page padding 40px.
- Content max-width 1180px (1240px for the image grid), centered.
- Two-column bodies: `repeat(auto-fit, minmax(300–340px, 1fr))`, gap `clamp(32px, 5–6vw, 80–90px)`.
- Hairline panels: flex-wrap rows, `gap:1px`, each cell `flex:1 1 150–240px` with its own `1px solid rgba(233,226,211,0.12)` border. (Do **not** fake hairlines with a tinted container + 1px grid gap — empty cells in the last row render as a grey slab.)
- Radius: none anywhere except the 2px language button. Shadows: only text-shadows over photography.

## Screens / Views
One continuous page. Section order is fixed by the brand document — keep it.

1. **Nav** (fixed, z-50) — wordmark left; links Core Value / Process / Approach / Systems / About; brass "Request a Consultation" with a `rgba(184,147,95,0.45)` underline; language button (`עב` / `EN`, 1px `rgba(233,226,211,0.22)` border, 10px/600/0.18em). Background `rgba(24,19,16,0.28)` + `backdrop-filter:blur(14px)`, becoming `rgba(24,19,16,0.92)` past 0.8×viewport; transitions `background/border-color/transform 0.6s cubic-bezier(.22,.61,.36,1)`.
2. **Hero** — 100vh (min 640px), full-bleed photo (`images/room-wall-system.jpg`), photo shown **ungraded** (no filters/duotone). Two stacked scrims: vertical `linear-gradient(180deg, .52 → .42 @34% → .46 @62% → .78)` black, plus `radial-gradient(closest-side at 50% 48%, rgba(0,0,0,.62), rgba(0,0,0,.28) 62%, transparent)` as a legibility plate behind the lockup. Centered lockup: ELIYAH `clamp(46px,9vw,132px)`, ACOUSTIC `clamp(11px,1.5vw,16px)`, 1px×52px brass gradient rule, tagline "Sound, Shaped by Space" 12px/500/0.28em brass. Bottom row: positioning line (12px, max 360px) left, "Scroll" 10px/0.3em right.
3. **Vision** — label + `h1` `clamp(30px,5vw,68px)` (max-width 18em) + one body paragraph (max 46em).
4. **Core Value** — head `clamp(30px,5vw,68px)`, sub line, then three bordered cells numbered 01–03 (brass 10px/0.22em), closing display line `clamp(21px,2.6vw,32px)` max 24–34em.
5. **Experience Principle** — pinned band: outer `section{height:170vh}`, inner `div{position:sticky;top:0;height:100vh;overflow:hidden}` holding `images/burl-pair-wide.jpg`. Scrims: vertical `180deg .30 → .62 @42% → .78` plus a directional `linear-gradient(100deg …)` that becomes `260deg` in RTL so the copy always sits on the dark side. Copy block is `pointer-events:none`, vertically centered, padding `0 clamp(32px,7vw,110px)`, max-width 900px; head `clamp(28px,4.8vw,64px)`; two closing lines ("Conversation stops" / brass "Movement begins") in a 36px-gap row.
6. **Structure of Service** — 5 rows, `grid-template-columns: 80px minmax(150px,1.1fr) 2fr`, gap `clamp(16px,4vw,56px)`, padding `34px 20px 36px`, `border-top:1px solid rgba(233,226,211,0.14)`; hover `background:linear-gradient(90deg, rgba(58,33,66,0.6), rgba(24,19,16,0))` over `0.5s` (flip to 270deg in RTL). Number brass 11px/600/0.2em; title `clamp(20px,2.3vw,29px)`.
7. **Project Scope** — two columns: head `clamp(26px,3.6vw,46px)` left; right column intro + three rows separated by `border-top` hairlines.
8. **Eliyah Acoustic** — label + head `clamp(28px,4.6vw,62px)` (max 15em) + two-column body.
9. **Approach** — 50/50 split: photo panel (`images/cherry-single.jpg`, `min-height:min(88vh,760px)`) and a centered text column padded `clamp(56px,8vw,110px) clamp(32px,6vw,96px)`; five bordered "room factor" chips (11px/500/0.1em) between two paragraphs.
10. **Experience** — two columns: text left; right a 1px-gap stack of three display lines `clamp(19px,2.3vw,29px)`, the third brass.
11. **Sound & Individual Perception** — head left, single paragraph right.
12. **Material & Form** — label/head/body, then a 6-up photo grid: `repeat(auto-fit, minmax(280px,1fr))`, gap `clamp(18px,2.2vw,32px)`, each cell `aspect-ratio:3/4;overflow:hidden` with a cover image (`sys-cherry-wave / sys-burl-oval / sys-oak-steel / sys-steel-stack / sys-ivory-column / sys-black-octagon`).
13. **Application** — head `clamp(26px,3.8vw,50px)` + four bordered cells + closing paragraph.
14. **Manifesto** — head `clamp(34px,6vw,86px)` ("Sound is not fixed. It is shaped."), two-column body, closing display line `clamp(22px,3vw,38px)`.
15. **About** — the page's only light section: background `#E9E2D3`, text `#181310`. Left `aspect-ratio:4/5` portrait (`images/sys-cherry-tall.jpg` — placeholder; a real team photo belongs here), right label/head/two paragraphs/pull-quote above a `rgba(24,19,16,0.16)` rule. Below, a Team row: Bar Dadush, Ofer Uziel, Maayan Dadush (name 22px display, role 12px/1.8).
16. **Consultation** — head `clamp(30px,5.4vw,78px)`, body, then "Request a Consultation" (display `clamp(20px,2.4vw,30px)`, 1px brass underline, 10px padding-bottom) + "Begin a System" (11px/600/0.22em uppercase, `rgba(233,226,211,0.72)`). Hover on both → brass.
17. **Footer** — wordmark left; contact + credit right, 12px/1.9 at `rgba(233,226,211,0.6)`, `border-top` hairline.

## Interactions & Behavior
Implement with `requestAnimationFrame`-throttled scroll handling and an `IntersectionObserver`; honour `prefers-reduced-motion: reduce` by skipping all of it.

- **Reveal on enter:** elements carrying a reveal marker transition `opacity` and `transform` over `1.05s cubic-bezier(.22,.61,.36,1)`, staggered `index × 90ms`. Initial state `opacity:0; translate3d(0,32px,0)` only for elements below 0.85×viewport at init; observer options `{rootMargin:'0px 0px -10% 0px', threshold:0.04}`, unobserve after reveal.
- **Parallax:** each marked image gets `transform: scale(1.16) translate3d(0, (elementCenter − viewportCenter) × −speed, 0)`. Speeds: hero 0.10, pinned band 0.14, approach 0.09, grid tiles 0.05, about portrait 0.07. Skip elements more than 240px outside the viewport. The 1.16 scale is what hides the travel — keep it.
- **Hero:** over the first 0.7×viewport the lockup fades `1 → 0` and moves `0 → 64px` with `scale(1 → 0.96)`; the bottom row fades out over 0.35×viewport.
- **Pinned band:** progress `p = clamp(−rect.top / (rect.height − viewportHeight), 0, 1)`; copy translates `0 → −60px` and holds full opacity until `p = 0.74`, then fades to 0 by `p = 1`.
- **Nav:** hides (`translate3d(0,-105%,0)`) on downward scroll past one viewport, returns on any upward scroll or within the hero; solidifies past 0.8×viewport.
- **Language toggle:** swaps every string, sets `dir` to `ltr`/`rtl`, swaps font families and `--lh`, flips the two directional gradients (100deg↔260deg on the band, 90deg↔270deg on step hover), and persists to `localStorage['eliyah-lang']` (restored on load). After a language change the reveal observer must be re-initialised, since the DOM nodes are replaced.
- **Anchors:** `html{scroll-behavior:smooth}`; nav links target section ids (`#core`, `#process`, `#approach`, `#material`, `#about`, `#consultation`).
- **Root overflow:** the page wrapper uses `overflow-x: clip`, **not** `hidden` — `hidden` creates a scrollport and silently breaks `position:sticky` in the pinned band.

## State Management
Minimal; no data fetching.
- `lang: 'en' | 'he'` — the only real state; persisted in `localStorage`, and the right thing to move to the framework's i18n routing (`/` and `/he`) with `lang`/`dir` on `<html>`.
- `showTeam: boolean` — flag that hides the Team row.
- Scroll-effect values are transient (refs / direct style writes), never React state.
- All copy lives in one EN/HE dictionary keyed per section — port it to the codebase's translation files verbatim; the wording is client-approved brand text.

## Assets
Ten client-supplied photographs, copied from their originals into `images/` (JPEG, 1024–1456px on the long edge):
`room-wall-system.jpg` (hero, in-situ), `burl-pair-wide.jpg` (pinned band, landscape), `cherry-single.jpg` (approach panel), `sys-cherry-wave.jpg`, `sys-burl-oval.jpg`, `sys-oak-steel.jpg`, `sys-steel-stack.jpg`, `sys-ivory-column.jpg`, `sys-black-octagon.jpg` (grid), `sys-cherry-tall.jpg` (About portrait, placeholder for a real team photo).

Notes: photos must be shown **as shot** — no duotone, no colour filters, no grading; only black scrims where text overlays them. Serve responsive sources (`srcset`/next-gen formats) since several are used at full-bleed. Fonts: Fraunces, Manrope, Heebo (Google Fonts, open-licensed). The wordmark is set in type, not an SVG logo — request the vector lockup from the client for production. No icons anywhere by design.

## Files
- `Eliyah Acoustic Homepage.dc.html` — the design: markup + inline styles + scroll logic + full bilingual copy dictionary.
- `support.js`, `image-slot.js` — prototype runtime only; do not port.
- `images/` — the photography listed above.
- `eliyah-design-direction.html` — brand direction board (palette + type rationale).
