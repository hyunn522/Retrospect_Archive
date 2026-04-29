---
version: alpha
name: 회고 아카이브 — Line.me-inspired Design System
description: |
  Tokens extracted from line.me (2026-04-29). Achromatic monochrome canvas
  (white / near-black / mid-gray) with a single brand-green action color, a
  pill-radius button language, and a soft 20px ambient drop shadow as the
  primary elevation primitive. All values below are derived from the live
  computed-style audit in output/line.me/2026-04-29T17-16-11-573Z.json;
  anything not present in the source is marked TBD.

colors:
  surface.canvas:          "#ffffff"  # 643 occurrences, page background
  surface.inverse:         "#1e1e1e"  # 213 occurrences, dark surfaces / primary text
  text.primary:            "#1e1e1e"  # the warm-near-black used on light surfaces
  text.secondary:          "#616161"  # 126 occurrences, secondary copy
  text.true-black:         "#000000"  # 760 raw occurrences (browser default residue)
  text.inverse:            "#ffffff"  # text on dark / brand surfaces
  accent.brand:            "#07b53b"  # Line Green, extracted from primary button bg
  link.fallback-blue:      "#0000ee"  # raw browser-default link color present in extract
  border.on-light:         "rgba(30, 30, 30, 0.2)"   # 1px button border on white
  border.on-dark:          "rgba(255, 255, 255, 0.3)" # 1px link border on dark
  border.hairline:         "rgba(0, 0, 0, 0.15)"      # 1px li border, content row separator

typography:
  display.lg:
    fontFamily: "LINESeed, SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "70px"
    fontWeight: 700
    lineHeight: TBD
    letterSpacing: TBD

  display.md:
    fontFamily: "LINESeed, SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "60px"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: TBD

  heading.lg:
    fontFamily: "SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.20
    letterSpacing: TBD

  heading.md:
    fontFamily: "SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: TBD
    letterSpacing: TBD

  heading.sm:
    fontFamily: "SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: TBD

  heading.xs:
    fontFamily: "SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: TBD
    letterSpacing: TBD

  body.lg:
    fontFamily: "SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.60
    letterSpacing: TBD

  body.md:
    fontFamily: "SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.56
    letterSpacing: TBD

  link.lg:
    fontFamily: "SFPro, Arial, 'Noto Sans JP', AppleSDGothicNeo"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.23
    letterSpacing: TBD

  link.md:
    fontFamily: "LINESeed, SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 4.00      # used as a tappable nav row, line-height = box height
    letterSpacing: TBD

  link.sm:
    fontFamily: "LINESeed, SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 3.57
    letterSpacing: "-0.3px"

  link.xs:
    fontFamily: "LINESeed, SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 3.54
    letterSpacing: "-0.3px"

  button.label:
    fontFamily: "SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.40
    letterSpacing: TBD

  caption.md:
    fontFamily: "SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 3.85
    letterSpacing: TBD

  caption.sm:
    fontFamily: "SFPro, Arial, 'Noto Sans JP', 'Noto Sans KR'"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: TBD
    letterSpacing: TBD

spacing:
  1: "4px"     # micro gap, count 3
  2: "8px"     # base unit, count 97 (most common)
  3: "12px"    # count 20
  4: "14px"    # count 2 (typography-adjacent)
  5: "16px"    # count 83 (second most common)
  6: "20px"    # count 27
  7: "28px"    # count 2
  8: "30px"    # count 77 (high-frequency section gap)
  9: "32px"    # count 1
  10: "36px"   # count 16
  11: "40px"   # count 38
  12: "60px"   # count 3
  13: "70px"   # count 1
  14: "85px"   # count 3
  15: "160px"  # large gap (sections)
  16: "180px"
  17: "270px"

rounded:
  sm: "4px"    # high confidence, used on div / li / a (count 145)
  md: "10px"   # low confidence (count 2 on ul/li)
  lg: "16px"   # high confidence, used on images (count 76)
  pill: "50px" # medium confidence, exclusively on buttons (count 9)

components:
  button.primary:
    backgroundColor: "{colors.accent.brand}"
    textColor: "{colors.text.inverse}"
    typography: "{typography.button.label}"
    padding: "8px 15px"
    rounded: "{rounded.pill}"
    # extras (non-spec, see prose): border 1px solid {colors.accent.brand}

  button.secondary:
    backgroundColor: "transparent"
    textColor: "rgba(30, 30, 30, 0.7)"
    typography: "{typography.button.label}"
    padding: "8px 15px"
    rounded: "{rounded.pill}"
    # extras: border 1px solid {colors.border.on-light}

  link.default:
    textColor: "{colors.text.primary}"
    typography: "{typography.link.md}"

  link.inverse:
    textColor: "{colors.text.inverse}"
    typography: "{typography.link.md}"

  card.image:
    backgroundColor: "{colors.surface.canvas}"
    rounded: "{rounded.lg}"

  input.text: TBD
  input.checkbox: TBD
  input.radio: TBD
  input.select: TBD
  badge: TBD

elevation:
  ambient: "rgba(0, 0, 0, 0.1) 0px 20px 20px 0px"   # primary lift, count 39
  hairline: "rgba(0, 0, 0, 0.1) 0px 1px 0px 0px"     # divider-as-shadow, low confidence
  inset: "rgba(0, 0, 0, 0.2) 0px -0.6px 0px 0px inset" # inner top-edge, low confidence

breakpoints:
  xs: "422px"
  sm: "800px"
  md: "878px"
  lg: "879px"
---

# DESIGN.md — 회고 아카이브

> Inspired by line.me. All token values above are extracted from a live audit
> of `https://www.line.me/en/` on 2026-04-29 (see `output/line.me/`).
> Anything the audit did not surface is `TBD` and must not be invented.

## Overview

Line.me reads as **achromatic-plus-one**: a near-pure white canvas, two grays
(near-black `#1e1e1e` for headings/text and a mid-gray `#616161` for support),
and a single saturated **brand green** (`#07b53b`) reserved for the primary
call-to-action. There are no decorative hues, no gradients, no tinted surfaces.
The visual identity comes from three places:

1. **A custom display family (`LINESeed`)** at heading sizes, with `SFPro`
   stepping in for the Latin/Korean body text via a long fallback chain
   (`Arial → Noto Sans JP → Noto Sans KR → AppleSDGothicNeo`). Weight is
   binary in practice — 700 for almost anything labeled, 400 for prose.
2. **Pill buttons (`50px` radius)** as the only place rounding goes large.
   Other rounding is restrained: `4px` on containers/links, `16px` on images.
3. **One soft drop shadow** (`0 20px 20px rgba(0,0,0,0.1)`) carrying *all*
   ambient elevation. There is no shadow scale — there is one shadow.

The system is content-forward: copy and product imagery do the talking, and
chrome stays out of the way. Apply this voice to 회고 아카이브 by holding the
canvas to white, locking primary action to the brand green, and letting the
type hierarchy (large → quiet) carry rhythm instead of color.

## Colors

| Token | Value | Source / Notes |
|---|---|---|
| `surface.canvas` | `#ffffff` | Page background. The dominant color in the audit (643 occurrences). |
| `surface.inverse` | `#1e1e1e` | Dark surfaces (footer, hover states). Same value as `text.primary`. |
| `text.primary` | `#1e1e1e` | Warm near-black. Heading/body copy on light. The slight warmth softens contrast. |
| `text.secondary` | `#616161` | Secondary copy and support text (126 occurrences). |
| `text.true-black` | `#000000` | Present (760 raw count) but largely from browser defaults; **prefer `text.primary`**. |
| `text.inverse` | `#ffffff` | Text on the brand green and on dark surfaces. |
| `accent.brand` | `#07b53b` | The single non-neutral. Reserved for primary CTAs. Do not use decoratively. |
| `link.fallback-blue` | `#0000ee` | Raw browser link color leaking through; treat as a bug, not a token. |
| `border.on-light` | `rgba(30,30,30,0.2)` | 1px hairline used on the secondary button on white. |
| `border.on-dark` | `rgba(255,255,255,0.3)` | 1px hairline used on links over dark surfaces. |
| `border.hairline` | `rgba(0,0,0,0.15)` | List-row separator on light. |

**Application:**

- Map 회고 아카이브의 카테고리(devs/love/life)는 token이 정의하지 않으므로 TBD —
  현재 코드베이스의 워크플로우 컬러는 line.me 추출 결과에 없는 색이다. 카테고리
  강조가 필요하면 brand green을 단일 액션 색으로만 쓰고, 카테고리 구분은 **타이포·
  레이블·아이콘으로** 처리하는 것이 line.me 스타일에 맞다.
- Error 컬러는 추출되지 않음 — TBD.

## Typography

Two families do almost all the work. `LINESeed` is the brand voice (display
and call-to-action labels); `SFPro` carries reading text and small links,
falling through `Arial → Noto Sans JP → Noto Sans KR → AppleSDGothicNeo` for
multi-script coverage.

### Scale

| Token | Family | Size | Weight | Line | Tracking |
|---|---|---|---|---|---|
| `display.lg` | LINESeed | 70px | 700 | TBD | TBD |
| `display.md` | LINESeed | 60px | 700 | 1.33 | TBD |
| `heading.lg` | SFPro | 40px | 700 | 1.20 | TBD |
| `heading.md` | SFPro | 24px | 700 | TBD | TBD |
| `heading.sm` | SFPro | 22px | 700 | 1.18 | TBD |
| `heading.xs` | SFPro | 20px | 700 | TBD | TBD |
| `body.lg` | SFPro | 20px | 400 | 1.60 | TBD |
| `body.md` | SFPro | 18px | 500 | 1.56 | TBD |
| `link.lg` | SFPro | 16px | 700 | 1.23 | TBD |
| `link.md` | LINESeed | 15px | 700 | 4.00 | TBD |
| `link.sm` | LINESeed | 14px | 700 | 3.57 | TBD |
| `link.xs` | LINESeed | 13px | 700 | 3.54 | -0.3px |
| `button.label` | SFPro | 13px | 700 | 1.40 | TBD |
| `caption.md` | SFPro | 13px | 400 | 3.85 | TBD |
| `caption.sm` | SFPro | 11px | 400 | TBD | TBD |

### Principles

- **Weight is binary.** 700 announces (display, headings, links, button labels).
  400 reads (body copy, captions). 500 appears once on `body.md` and is the
  sole exception. Do not introduce 600 — it is not in the audit.
- **Compressed line-height on display, relaxed on links.** Headings sit at
  ~1.18–1.33 (tight, billboard). Some link styles carry `line-height: 3.5–4.0`
  — that is **not relaxed prose**, it is the link being used as a tappable
  navigation row where line-height equals the touch-target height. Do not copy
  these line-heights onto running text.
- **Negative tracking only at small link sizes.** `letter-spacing: -0.3px`
  appears at 13–14px Korean/Japanese-mixed link rows for tighter glyph fit. Do
  not apply to display sizes.

## Layout

### Spacing

The system is on an **8px base** with the busiest values at `8px` and `16px`.
Above 40px, the scale is sparse — large vertical rhythm comes from `60`, `70`,
`85`, then jumps to hundreds (`160`, `180`, `270`).

| Step | px | Frequency | Use |
|---|---|---|---|
| 1 | 4px | 3 | micro tweaks |
| 2 | 8px | 97 | **base unit** — gaps between siblings, button vertical padding |
| 3 | 12px | 20 | small label-to-input gap |
| 4 | 14px | 2 | rare; typography-adjacent |
| 5 | 16px | 83 | **default container padding**, comfortable reading gap |
| 6 | 20px | 27 | between heading and supporting copy |
| 7 | 28px | 2 | rare |
| 8 | 30px | 77 | **section vertical rhythm** — the workhorse for chunk separation |
| 9 | 32px | 1 | rare |
| 10 | 36px | 16 | between content blocks |
| 11 | 40px | 38 | major separation within a section |
| 12 | 60px | 3 | between sections |
| 13 | 70px | 1 | hero top padding |
| 14 | 85px | 3 | hero / footer padding |
| 15+ | 160 / 180 / 270 px | — | full-bleed / column gutters |

> Note: `30px` is used more than `32px`. The system is *not* strictly multiples
> of 8 above 16 — `30`, `70`, `85` all break the grid. Treat `30` and `40`
> as semantic equals (component-internal vs. between components).

### Breakpoints

`422 / 800 / 878 / 879 px`. The `878 / 879` pair is suspicious — likely a
single breakpoint with two adjacent rules. Treat as **three real breakpoints**:

- **xs (≤ 422px)** — single column, full-bleed.
- **sm (≤ 800px)** — tablet.
- **md (≥ 878px)** — desktop layout begins.

Container max-width was not extracted (TBD); use the `1079.03px` figure
showing up in the spacing scale as a **likely content max-width**.

## Elevation & Depth

The audit found exactly three shadow declarations; only one is high-confidence:

| Token | Shadow | Confidence | Use |
|---|---|---|---|
| `elevation.ambient` | `rgba(0,0,0,0.1) 0px 20px 20px 0px` | high (count 39) | **The shadow.** Cards, dropdowns, anything that needs to lift off the page. |
| `elevation.hairline` | `rgba(0,0,0,0.1) 0px 1px 0px 0px` | low | divider-as-shadow under sticky bars |
| `elevation.inset` | `rgba(0,0,0,0.2) 0px -0.6px 0px 0px inset` | low | inner top-edge highlight |

There is **no shadow scale**. If you need a hierarchy of elevation, encode it
through stacking order, surface tint, and spacing — not multiple shadows.

## Shapes

### Border Radius

| Token | Value | Confidence | Where it shows up |
|---|---|---|---|
| `rounded.sm` | `4px` | high (count 145) | divs, links, list items, small containers |
| `rounded.md` | `10px` | low (count 2) | uls/lis only — treat as exception |
| `rounded.lg` | `16px` | high (count 76) | image cards |
| `rounded.pill` | `50px` | medium (count 9) | **buttons only** |

Pill radius is a **button-only signature** in this system. Do not promote it
to badges, inputs, or cards. Containers stay at `4px`; images stand out at
`16px`.

## Components

### Button — Primary

| Property | Value |
|---|---|
| `backgroundColor` | `{colors.accent.brand}` (`#07b53b`) |
| `textColor` | `{colors.text.inverse}` (`#ffffff`) |
| `typography` | `{typography.button.label}` (SFPro 13px / 700 / 1.40) |
| `padding` | `8px 15px` |
| `rounded` | `{rounded.pill}` (`50px`) |
| border (extra) | `1px solid {colors.accent.brand}` |
| hover | outline removed (`outline: 0px`) — **no extracted hover bg/text shift** |
| focus | outline removed (`outline: 0px`) — relies on browser default outside extract |

### Button — Secondary

| Property | Value |
|---|---|
| `backgroundColor` | `transparent` |
| `textColor` | `rgba(30, 30, 30, 0.7)` |
| `typography` | `{typography.button.label}` |
| `padding` | `8px 15px` |
| `rounded` | `{rounded.pill}` |
| border (extra) | `1px solid {colors.border.on-light}` |

Both buttons share the same metrics — only the surface and text colors flip.
This is the system's "outlined alt" pattern: ghost a primary by stripping its
fill and dropping the text to 70% opacity.

### Links

Three contexts surfaced in the audit:

- **Default link on light:** `color: {text.primary}`, `text-decoration: none`,
  `font-weight: 700`. Underlines are not used; emphasis comes from weight.
- **Browser-default residue:** `color: #0000ee` — appears in the extract but
  is not a deliberate token. Override.
- **Link on dark:** `color: {text.inverse}`, no underline, weight 400.

### Inputs

**TBD.** No text inputs, checkboxes, radios, or selects were captured by the
audit. Do not invent — when wiring forms, reuse the button's metrics
(`8px 15px` padding, `13px` label) and the `rounded.sm` (`4px`) radius for
field wrappers as the closest available primitives.

### Badges

**TBD.** No badge patterns surfaced.

## Do's and Don'ts

### Do

- **Hold the canvas to `#ffffff`.** Surfaces almost never tint.
- **Reserve `accent.brand` (`#07b53b`) for the single primary action** on a
  given screen. It is the only chromatic color in the system.
- **Pair `LINESeed` (display/links) with `SFPro` (body)**, and let the long
  fallback chain handle Korean/Japanese (`Noto Sans KR / JP`,
  `AppleSDGothicNeo`).
- **Use `rounded.pill` only on buttons.** Containers get `4px`, images `16px`.
- **Lean on one shadow** (`elevation.ambient`) for everything that needs lift.
- **Hierarchy through size and weight, not color.** Move from 700 announce →
  400 read; let `text.secondary` (`#616161`) do all the "supporting copy"
  work.

### Don't

- **Don't introduce decorative color.** Greens, blues, pinks beyond the brand
  green are not in the system. The audit's `#0000ee` link blue is a leak.
- **Don't add weight 600.** The system is binary 700 / 400 (with one 500
  exception on `body.md`). 600 will read as off-brand.
- **Don't apply `line-height: 3.5–4.0` to running prose.** Those values are
  vertical-centering tricks for tappable nav rows, not body settings.
- **Don't stack shadows.** There is no `elevation.md` between flat and
  `elevation.ambient`. If something needs less, give it none.
- **Don't pill non-button surfaces.** The 50px radius is a button signature;
  badges and inputs should stay at `rounded.sm`.
- **Don't fill in TBD slots from training data.** If inputs/badges/error
  colors aren't in this file, they aren't in the system. Treat as an explicit
  follow-up to extract from a deeper crawl, not a gap to paper over.
