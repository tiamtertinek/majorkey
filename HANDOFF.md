# MajorKey redesign — Webflow handoff

Built to the Povio Webflow design rules v1.3.0. Three pages: `index.html`, `products.html`, `capabilities.html`, one `style.css`, one `script.js`.
`povio-template.css` is a **local stand-in** for the template's variables + `u-*` utilities so the preview renders — **do not migrate it**; it only records the values below.

Working from core-template token structure, re-valued to MajorKey. Colours and fonts were matched to the design PNGs, not verified against a live Webflow variable set.

## Variables
**Re-value (exist on the template):**
- Fonts: `--_typography---font--primary|secondary|tertiary` → Rubik (self-hosted woff2 in `assets/fonts`).
- Typescale: headline-1 3.625rem/1.05 · headline-2 2.625rem/1.04 · title-1 2.625rem/1.15 · title-2 2.5rem/1.1 · title-3 2rem/1.1 · title-4 1.875rem/1.32 · title-5 1.5rem/1.3 · title-6 1.25rem/1.32 · body-1…4 1.25/1.125/1/0.875rem · label-1 0.875rem ls 0.1em · label-2 0.75rem ls 0.08em · label-3 0.75rem ls 0.14em (see stand-in for min values).
- Spacing: section xs 2.5 · sm 6.25 · md 6.875 · lg 9rem; margin-xl 4.75rem (page gutter); inner-sm 1.625rem.
- Colour: bg default `#fff/#f8f7fa/#f4efff`, inverted `#1d063b/#15052a/#2a1547`; text default `#1d063b/#434343/#727272`, inverted `#fff/82% white/#b4b3b5`, brand `#6900ff/#907ffe/#bf93fd`; interactive primary green `#0de481`, secondary mint `#c3edd8`, outline navy, outline-inverted white; `info--success` `#0de481` (footer headings/legal links).
- Radius: sm 0.375 · md 0.75 · lg 0.875 · xl 1.875rem (tablet/mobile modes step down).

**Create (1):** `--_color---bg--brand--bg` `#6900ff` — the purple CTA and testimonial surfaces; no existing variable is a brand background.

## Components
- **Reused:** Nav, Footer, Button Main (restyled: green rounded rectangle; variants `is-primary`, `is-secondary`, `is-outline`, `is-outline-inverted`, sizes `is-nav`, `is-compact`), Clickable, Skip to Main, Contact Form classes (`form_*`) for the newsletter, Swiper CSS/JS.
- **New components (promote to Webflow Components):** `section_head_wrap` (eyebrow/title/text props), `feature_card_wrap` (`is-product`), `resource_card_wrap`, `success_section` (tabs), `page_hero_section`, `cta_section`, `stat_wrap`.
- **Section-scoped:** `home_hero_*`, `logos_*`, `scenarios_*`, `framework_*`, `services_*`/`service_card_*`, `industries_*`, `testimonial_card_*`, `tools_*`, `products_*`, `testimonial_*`, `stack_*`.

## Mapping notes
- Prose is `<p>`; eyebrows, labels, stats, kickers are Text Blocks (`<div>`); every button label is its own element inside Button Main.
- **CMS-ready:** resource cards (fields: type, title, summary, image, link), customer success panels (tab label, title, summary, image, stat value, stat label, service tags, link), product/solution cards (category, name, summary, link), capability stack cards (title, summary, image, link, dot colour combo).
- **Swiper (resources):** `resources_slider_list` takes `swiper-wrapper` (Collection List), `resource_card_wrap` takes `swiper-slide` (Collection Item). Pagination uses our own classes (`resources_slider_dot` / `is-active`) so no vendor class is styled.
- **Nav scrolled state** (`nav_component.is-scrolled`): the nav is always fixed; on scroll the navy bar, shadow and radius `md` sit on `nav_layout` only (parent-state descendant), so the bar spans the content row (logo → button) with 0.75rem inset, not the full width. Background, shadow, padding and margin use native transitions (0.6s), so it eases both in and out.
- **Framework list (home)** is single-open tabs: each item is `<h3><button aria-expanded aria-controls>` + a `role=region` panel; `framework_item.is-open` drives styling, JS toggles `hidden` and tweens height with GSAP. The wheel is static (no motion).
- **Framework wheel** is an inline SVG; each segment path carries `framework_wheel_segment` + `data-fw-segment="1-5"`. JS adds `is-selecting` on the SVG and `is-active` on the matching segment (parent-state descendant CSS — embed). Clicking a segment opens its tab.
- **Customer success panels** share one grid cell (`success_panels` is grid, each `success_panel` is `grid-area: 1/1`), so the section height is locked to the tallest story; inactive panels are `visibility: hidden` + `inert`.
- **Customer success photo** fills the full section height: the section is the positioning context (`isolation: isolate`), the image sits behind content at `z-index: -1`.
- **Logo band edge fades:** two decorative `logos_fade` divs (`is-start` / `is-end`) inside `logos_marquee`, gradient from the band colour (`bg--default--1`) to transparent; the row is full-bleed (`u-container-0`).
- **Combo placeholders** kept in `*_hidden` blocks: `nav_component.is-scrolled`, `nav_menu.is-open`, `success_tab.is-active`, `success_panel.is-active`, `resources_slider_dot.is-active`.
- **GSAP plugins to enable** in Webflow's built-in integration: ScrollTrigger, SplitText. Remove the CDN `<script>` tags — they exist only for the local preview. Reduced motion is respected: with `prefers-reduced-motion`, no motion runs.
- Newsletter form: validation and success/error states are wired visually; **submission is not wired** — hook to HubSpot as today.

## Motion (script.js)
Block 1 (simple, IX3-convertible): nav + hero entrance, hero media settle + parallax, scroll reveals, card staggers, surface lift, resource image zoom. Block 2 (custom): SplitText hero line mask, count-up stats, stacking-card body fade, logo marquee (clones the real items at runtime).

## Exceptions (custom code the developer carries)
1. Card grids (`scenarios_list`, `services_list`, `tools_list`, `industries_stats`) — CSS grid; no grid utilities exist (step 6).
2. Button Main hover/active on the inner element (`.button_main_wrap.is-*:hover .button_main_element`) — parent-state descendant; ties into the template's `data-trigger` hover system (step 5 failed).
3. `.resource_card_wrap:hover .resource_card_img` zoom — parent hover descendant (step 5 failed).
4. `.footer_heading::after` gradient underline — pseudo-element (Style panel can't author).
5. `color-mix()` alpha tints for overlays/shadows and `mask-image` on the success photo — not available in the Style panel.
6. Tabs, nav toggle, marquee clone, newsletter states, GSAP — `script.js`, sitewide in Global JS.

## Deviations (built differently from the file, per the system)
- Nav logo uses the real MajorKey logo instead of the placeholder square mark in the design.
- Type, spacing and radius snap to the re-valued scale, so some values sit a few px off the PNG.
- Framework and stack dot colours snap to the brand colour family (5 shades → 4 variables).
- All card rows align to the page gutter and share one card gap (`gap-lg`); the design's Services overhang and the capability divider overhang were dropped.
- Customer-success copy for tabs 2–5 was shortened from the live site to match the new layout — **placeholder, confirm with MajorKey**. Same for home resource card titles.

## Links
- Hero secondary CTA "See how we help": Home → `/capabilities`, Products → `/capabilities`, Capabilities → `/#services`. No CTA scrolls within its own page.
- "Talk to an identity expert" / "Contact us" → `https://www.majorkeytech.com/contact-us` (swap for the Webflow contact page slug).
- Scenario card copy rewritten as problems (kickers: Idira migration, Adopting AI, Identity fraud, Healthcare access) — **placeholder, confirm with MajorKey**.

## Assets (in `assets/img`)
Hero video `hero.mp4` (+ poster), page hero `v2/page-hero.jpg` (3:2), capability photos `v2/cap-*.jpg` (448×317 crop), resource images `v2/res-*.jpg` (16:9-ish, 181px tall crop), success photos, partner logos, wheel/illustration SVGs, patterns, quote mark, testimonial marks.

## Page metadata
- `/` — "Identity Security for Modern Enterprises | MajorKey"
- `/products` — "Identity Products | MajorKey Innovation Labs"
- `/capabilities` — "Identity Capabilities | MajorKey"
Descriptions are in each page's `<head>`. OG image: hero still for each page.
