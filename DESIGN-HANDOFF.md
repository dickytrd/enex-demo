# 95a708a1-ac73-4c4e-9adb-69faa0580dd9 implementation handoff

This archive is the source of truth for turning the design into production code. Start from `index.html`, then preserve the visual system, responsive behavior, and interactions found in the exported files.

## Implementation target
- Build production UI from the exported design, not a loose reinterpretation.
- Preserve typography scale, spacing rhythm, color tokens, border radii, shadows, motion timing, and component states.
- Replace static placeholders only when the target app has real data or functional equivalents.
- Keep generated product UI free of Open Design chrome, preview labels, or design-process annotations.
- Treat this handoff as a visual contract: if implementation choices conflict, match the exported pixels and behavior first, then refactor internals.

## Source map
- Primary entry: `index.html`
- HTML screens detected: 9
- Stylesheets detected: 1
- Script/component files detected: 1
- Supporting assets detected: 183

## Responsive contract
Validate the implementation across this 2025–2026 viewport matrix:
- Mobile compact: 360×800
- Mobile standard: 390×844
- Mobile large: 430×932
- Foldable / small tablet: 600×960
- Tablet portrait: 820×1180
- Tablet landscape: 1024×768
- Laptop: 1366×768
- Desktop: 1440×900
- Wide desktop: 1920×1080

For responsive web exports, treat these as a modern breakpoint system for one adaptive web experience, not three fixed screenshots. Do not split responsive web into unrelated native app screens unless the project explicitly includes native targets. Use semantic layout thresholds, fluid `clamp()` type/spacing, and container queries where component width matters more than viewport width. Preserve any CSS media queries, container queries, fluid `clamp()` scales, and layout changes already present in the exported files.

## Design fidelity contract
- Extract reusable tokens before writing components: background, surface, foreground, muted text, border, accent, radius, shadow, spacing, type scale, and motion duration/easing.
- Map product screens, in-app modules/components, optional landing page, and optional OS widget surfaces before coding. Keep these surfaces separate in the target architecture.
- Match layout geometry: max-widths, gutters, grid columns, card proportions, sticky/fixed elements, and viewport-specific navigation.
- Preserve real copy, labels, and data shown in the export. Do not replace specific text with generic marketing filler.
- Preserve interactive affordances: hover, focus, pressed, disabled, loading, validation, copy/share, tab/accordion, modal/sheet, and keyboard states where present.
- Preserve accessibility semantics when converting: headings stay hierarchical, controls remain buttons/links/inputs, focus states stay visible.
- Do not keep prototype-only annotations, frame labels, or Open Design chrome in the production UI.

## CJX-ready UX contract
- Use `DESIGN-MANIFEST.json` as the machine-readable map for screens, app modules, OS widgets, landing pages, tokens, interactions, and viewport checks.
- Screen-file-first: when multiple user-facing surfaces exist, implement each HTML screen as its own route/file. Treat `index.html` as a launcher/overview when the manifest marks it that way, not as a combined final UI.
- If `landing.html`, app screens, platform screens, or OS widget files exist, preserve those boundaries in the target app instead of merging them into one page.
- A single self-contained `index.html` is acceptable only when the export truly contains one user-facing screen and its CSS/JS are structured enough to extract tokens, components, states, and behavior.
- If separate `css/` or `js/` files exist, treat them as source of truth for token/component/interactions before porting to React, Vue, SwiftUI, Compose, or another target stack.
- In-app modules/components are product UI blocks inside the app. OS widgets are home-screen/lock-screen/quick-access surfaces outside the app. Do not merge those concepts.

## Color and brand contract
- Use the exported design tokens and product/domain context as the color source of truth.
- Do not introduce warm beige / cream / peach / pink / orange-brown background washes unless they are already explicit brand/reference colors in the export.
- A stylesheet or design/token file was detected; inspect it for canonical color variables before choosing framework theme tokens.

## Implementation sequence for AI coding tools
1. Open `index.html` and `DESIGN-MANIFEST.json`; identify every screen file, launcher/overview file, app module, and interaction before coding.
2. If multiple HTML screens exist, map them to separate routes/surfaces first; do not merge `landing.html`, product app screens, platform screens, or OS widgets into one route.
3. Extract a token table from CSS/root styles and inline styles before building framework components.
4. Build product screens and domain-specific in-app modules from largest layout regions down to controls; avoid starting with isolated atoms that lose spatial intent.
5. Port responsive behavior across the modern viewport matrix and test each semantic breakpoint before cleanup.
6. Port interactions and states, then replace static placeholders only with real app data or functional equivalents.
7. Keep optional landing page and OS widget surfaces as separate surfaces if present.
8. Compare final screenshots against the export at 360×800, 390×844, 430×932, 820×1180, 1024×768, 1366×768, 1440×900, and 1920×1080 before declaring done.

## Entry points
- `components/footer.html`
- `components/navbar.html`
- `enex-bonn-home.html`
- `impressum.html`
- `index.html`
- `kontakt.html`
- `leistungen.html`
- `referenzen.html`
- `uber-uns.html`

## Styles
- `css/styles.css`

## Scripts/components
- `js/main.js`

## Assets and supporting files
- `figma-data/full-response.txt`
- `figma-data/images-hero-swiper/hero-bg-1.png`
- `figma-data/images-hero-swiper/hero-bg-2.png`
- `figma-data/images-hero-swiper/hero-bg-3.png`
- `figma-data/images-hero-swiper/phone-1.png`
- `figma-data/images-hero-swiper/phone-2.png`
- `figma-data/images-hero-swiper/phone-3.png`
- `figma-data/images-impressum/enex-logo-slogan.svg`
- `figma-data/images-impressum/enex-logo.svg`
- `figma-data/images-impressum/frame39549.png`
- `figma-data/images-impressum/frame39550.png`
- `figma-data/images-impressum/impressum-screenshot.png`
- `figma-data/images-impressum/line3.svg`
- `figma-data/images-impressum/line4.svg`
- `figma-data/images-impressum/line5.svg`
- `figma-data/images-impressum/noise-grain.png`
- `figma-data/images-kontakt/divider-line.svg`
- `figma-data/images-kontakt/enex-logo-footer.svg`
- `figma-data/images-kontakt/enex-logo-slogan-contact.svg`
- `figma-data/images-kontakt/enex-logo-slogan-header.svg`
- `figma-data/images-kontakt/frame39549.png`
- `figma-data/images-kontakt/frame39550.png`
- `figma-data/images-kontakt/line4.svg`
- `figma-data/images-kontakt/line5.svg`
- `figma-data/images-kontakt/line6.svg`
- `figma-data/images-kontakt/noise-grain.png`
- `figma-data/images-leistungen/arrow-right.svg`
- `figma-data/images-leistungen/cta.png`
- `figma-data/images-leistungen/enex-logo1.svg`
- `figma-data/images-leistungen/fi-10351056.svg`
- `figma-data/images-leistungen/fi-12327003.svg`
- `figma-data/images-leistungen/fi-12327004.svg`
- `figma-data/images-leistungen/fi-12638125.svg`
- `figma-data/images-leistungen/fi-1688843.svg`
- `figma-data/images-leistungen/group-39502.svg`
- `figma-data/images-leistungen/group-39503.svg`
- `figma-data/images-leistungen/group-39504.svg`
- `figma-data/images-leistungen/group.svg`
- `figma-data/images-leistungen/group1.svg`
- `figma-data/images-leistungen/group2.svg`
- `figma-data/images-leistungen/hero.png`
- `figma-data/images-leistungen/idea.svg`
- `figma-data/images-leistungen/image17.png`
- `figma-data/images-leistungen/layer10.svg`
- `figma-data/images-leistungen/layer2.svg`
- `figma-data/images-leistungen/layer3.svg`
- `figma-data/images-leistungen/layer4.svg`
- `figma-data/images-leistungen/line5.svg`
- `figma-data/images-leistungen/line6.svg`
- `figma-data/images-leistungen/line7.svg`
- `figma-data/images-leistungen/line8.svg`
- `figma-data/images-leistungen/line9.svg`
- `figma-data/images-leistungen/service-1.png`
- `figma-data/images-leistungen/service-2.png`
- `figma-data/images-leistungen/service-3.png`
- `figma-data/images-leistungen/service-4.png`
- `figma-data/images-leistungen/showcase.png`
- `figma-data/images-leistungen/tag-icon.svg`
- `figma-data/images-mobile/0d25957117e8c6a873f779eefb1ca4343dda841b.png`
- `figma-data/images-mobile/1782d305f1167ca778fed0b6a7dff3b810ed72df.svg`
- `figma-data/images-mobile/1878a4f3e421e329d4db45772596cc9e30aa4f1b.svg`
- `figma-data/images-mobile/2b904afe87df87e4265903afa155a7629243b376.png`
- `figma-data/images-mobile/3622502d60e9ea9891f047cda54eee374b34a8ee.svg`
- `figma-data/images-mobile/3aaeaa54f01334f70b47d902d3e5790edd65dae0.png`
- `figma-data/images-mobile/434e6f44c7b3ae700b823c1b1a0461494778b657.svg`
- `figma-data/images-mobile/439713009a3bed54f25aafc9347e798a7f60b8db.svg`
- `figma-data/images-mobile/47ce2d2734682b3321ae86163762114aa02b6d1e.svg`
- `figma-data/images-mobile/5b0d08e836d57d6576c1836706f8ee934826232a.svg`
- `figma-data/images-mobile/63ff766bc57c53824f3624965d8296b03171c50c.svg`
- `figma-data/images-mobile/700a7d425ba721245ad5c3393cc0ba06063f452e.svg`
- `figma-data/images-mobile/71903fb69d0830294cd73b9e9928535ca6e68684.svg`
- `figma-data/images-mobile/7777bd47ba723fb9440e0dc8d1c30ada451f01b6.png`
- `figma-data/images-mobile/84ae5c8872a559c46b487ac50f22eade715ca171.svg`
- `figma-data/images-mobile/95fed64047c7e1213fb169b9f0968a47c8cd84c6.png`
- `figma-data/images-mobile/9868830628f21f9cd29bd5f80c455fc7f60000db.svg`
- `figma-data/images-mobile/b1301f6268df9a1b451a10522c756b85eb3be3e0.svg`
- `figma-data/images-mobile/b81c6475d486dfce0db7ed2ab33883c34afd8423.svg`
- `figma-data/images-mobile/ba64a69729ba9ab967dfcac24bd297f9b365cfa4.png`
- `figma-data/images-mobile/c0a2aea5e0b977c4611fedace8151b5e5ac74b27.svg`
- `figma-data/images-mobile/db0dae7c35f644edc5dd866619058b7030b58fbb.svg`
- `figma-data/images-mobile/db2f7b85a85d8be04643c149eee19d5590dfa182.png`
- `figma-data/images-mobile/e1cad8b9cfa5e5d586dbdd173867f336e3e07b12.svg`
- `figma-data/images-mobile/e49902a251a42537ef12800111f173e8420f8159.svg`
- `figma-data/images-mobile/enex-logo-slogan-mobile.svg`
- `figma-data/images-mobile/f62a2ebf6ac579a88d46792c306bcd4ef84d7a2e.svg`
- `figma-data/images-mobile/fefff773dcf740db3935cf7e618578e90a5858c0.svg`
- `figma-data/images-mobile/home-bg-mobile.png`
- `figma-data/images-mobile/menu-hamburger.svg`
- `figma-data/images-referenzen/arrow-group.svg`
- `figma-data/images-referenzen/arrow-right.svg`
- `figma-data/images-referenzen/arrow-up-right.svg`
- `figma-data/images-referenzen/cta.png`
- `figma-data/images-referenzen/enex-logo-slogan.svg`
- `figma-data/images-referenzen/enex-logo.svg`
- `figma-data/images-referenzen/fi-icon.svg`
- `figma-data/images-referenzen/footer-logo.svg`
- `figma-data/images-referenzen/frame-39549.png`
- `figma-data/images-referenzen/frame-39550.png`
- `figma-data/images-referenzen/frame-39601.png`
- `figma-data/images-referenzen/group-39502.svg`
- `figma-data/images-referenzen/hero.png`
- `figma-data/images-referenzen/image-14.png`
- `figma-data/images-referenzen/image-15.png`
- `figma-data/images-referenzen/image-16.png`
- `figma-data/images-referenzen/image-28.png`
- `figma-data/images-referenzen/image-showcase.png`
- `figma-data/images-referenzen/line.svg`
- `figma-data/images-referenzen/line4.svg`
- `figma-data/images-referenzen/line5.svg`
- `figma-data/images-referenzen/line6.svg`
- `figma-data/images-referenzen/project-1.png`
- `figma-data/images-referenzen/project-2.png`
- `figma-data/images-referenzen/project-3.png`
- `figma-data/images-referenzen/project-4.png`
- `figma-data/images-referenzen/project-5.png`
- `figma-data/images-referenzen/project-6.png`
- `figma-data/images-referenzen/showcase.png`
- `figma-data/images-referenzen/tag-icon.svg`
- `figma-data/images/arrow-right.svg`
- `figma-data/images/arrow-right1.svg`
- `figma-data/images/arrow-right2.svg`
- `figma-data/images/arrow-right3.svg`
- `figma-data/images/arrow-right4.svg`
- `figma-data/images/arrow-up-right.svg`
- `figma-data/images/cta-bg.png`
- `figma-data/images/enex-logo-footer.svg`
- `figma-data/images/enex-logo-slogan-uber.svg`
- `figma-data/images/enex-logo-slogan.svg`
- `figma-data/images/enex-logo.svg`
- `figma-data/images/frame39579.png`
- `figma-data/images/frame39582.png`
- `figma-data/images/frame39583.png`
- `figma-data/images/frame47.png`
- `figma-data/images/frame48.png`
- `figma-data/images/frame49.png`
- `figma-data/images/frame50.png`
- `figma-data/images/frame54.png`
- `figma-data/images/frame78.png`
- `figma-data/images/frame79.png`
- `figma-data/images/frame80.png`
- `figma-data/images/frame81.png`
- `figma-data/images/group39499.svg`
- `figma-data/images/group39500.svg`
- `figma-data/images/home-bg.png`
- `figma-data/images/image-showcase.png`
- `figma-data/images/image22.png`
- `figma-data/images/image23.png`
- `figma-data/images/image24.png`
- `figma-data/images/image4.png`
- `figma-data/images/line2.svg`
- `figma-data/images/line3.svg`
- `figma-data/images/line4.svg`
- `figma-data/images/line5.svg`
- `figma-data/images/logos-google-uber.svg`
- `figma-data/images/logos-google.svg`
- `figma-data/images/markus-spiske.png`
- `figma-data/images/material-add.svg`
- `figma-data/images/play.svg`
- `figma-data/images/rectangle4.png`
- `figma-data/images/rocket.svg`
- `figma-data/images/sketch-logo.svg`
- `figma-data/images/uber-line4.svg`
- `figma-data/images/uber-line5.svg`
- `figma-data/images/uber-line6.svg`
- `figma-data/images/uber-line7.svg`
- `figma-data/images/uber-uns-cta.png`
- `figma-data/images/uber-uns-hero.png`
- `figma-data/images/vector5.svg`
- `figma-data/images/vector6.svg`
- `figma-data/impressum-response.txt`
- `figma-data/kontakt-response.txt`
- `figma-data/kontakt-screenshot.png`
- `figma-data/leistungen-code.txt`
- `figma-data/mobile-code-decoded.txt`
- `figma-data/mobile-code.txt`
- `figma-data/mobile-full-response.txt`
- `figma-data/mobile-response.txt`
- `figma-data/referenzen-response.txt`
- `figma-data/screenshot.png`
- `figma-data/services-response.txt`
- `mqet4msb-FIGMA-IMPLEMENTATION-BRIEF-v2.md`
- `mqet4msc-figma-mcp-protocol-v2.md`
- `mqf0skq7-Screenshot-2026-06-15-at-16.37.55.png`

## Coding checklist for AI tools
1. Inspect `index.html` and `DESIGN-MANIFEST.json` first and identify reusable components before coding.
2. Implement each user-facing screen file as its own route/surface; keep launcher, landing, app, platform, and OS widget files separate.
3. Extract design tokens into the target stack: colors, type scale, spacing, radius, shadows, and motion.
4. Implement layout with real 2025–2026 responsive breakpoints, fluid type/spacing, and container-query-aware component behavior; test with no horizontal overflow.
5. Preserve interactive controls, hover/focus/pressed states, form behavior, validation, and copy actions where present.
6. Implement domain-specific in-app modules with real states; do not flatten them into generic cards.
7. Keep landing page, product screens, and OS widget/quick-access surfaces separate when present.
8. Confirm the production result visually matches the exported design before refactoring internals.
9. Reject implementation shortcuts that flatten the design into generic cards, generic gradients, placeholder stats, or framework-default typography.
10. If a detail is ambiguous, keep the exported HTML/CSS/JS behavior rather than inventing a new pattern.
