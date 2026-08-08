import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Approved technical architecture, Section 6 — Localization System:
// prefix-always routing (every URL always carries /en/ or /fr/, including
// the default locale) avoids ambiguity between "no prefix = English" and
// "no prefix = undetected", which is a common bilingual SEO pitfall.
export default defineConfig({
  // Placeholder — replace with the final production domain before deploy.
  // Required to generate absolute URLs (sitemap, canonical, hreflang, OG).
  site: 'https://www.moisetchorobaka.com',

  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
    },
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    // Stage 10: @astrojs/sitemap removed entirely. It crashed the build
    // twice in a row at the exact same internal location, even after
    // removing its i18n option — meaning the bug is deeper in the
    // package itself, not something fixable by adjusting its config
    // blind, without the ability to actually test it. Replaced with a
    // hand-written sitemap.xml.ts endpoint (see src/pages/sitemap.xml.ts)
    // — the same successful pattern already proven by robots.txt.ts,
    // which built correctly on the very first attempt.
  ],
});
