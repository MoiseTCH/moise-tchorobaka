# Moïse Tchorobaka — Website

Bilingual (EN/FR) personal brand website — Language, Writing, Digital & AI Services.

## Stack

- **Astro** — static site generation, content collections, native i18n routing
- **Tailwind CSS** — styling, driven by the approved design system's tokens
- **Decap CMS** — Git-based content management (`/admin`)

This project implements the previously approved brand strategy, information
architecture, visual design system, Decap CMS content architecture, SEO
architecture, and technical architecture documents. Those documents remain
the source of truth for any structural decision; this repository is their
implementation.

## Getting started

```bash
npm install
npm run dev
```

> Dependencies are not installed in this build environment (no network
> access here) — run `npm install` in an environment with internet access
> before `npm run dev` or `npm run build`. Every file in this repository has
> been written and manually reviewed for correctness, but has not yet been
> compiled by the actual Astro toolchain — see the Stage 1 build notes for
> details.

## Build stages

This project is being built progressively, in the order approved by the
project owner. Each stage is reviewed and approved before the next begins:

1. Project structure ← *current stage*
2. Global styles
3. Fonts
4. Theme system
5. Header
6. Footer
7. Localization system
8. CMS integration
9. Homepage
10. Services pages
11. Portfolio
12. Resources
13. Contact system

## Content

All page, service, portfolio, testimonial, FAQ, and article content lives in
`src/content/` and is managed through the Decap CMS admin UI at `/admin`
once deployed. No content is hardcoded into components — see the approved
technical architecture document, Section 3 and Section 6.
