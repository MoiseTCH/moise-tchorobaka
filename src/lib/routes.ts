import type { Locale } from '../i18n/config';
import { buildLocalizedPath } from '../i18n/utils';

/*
  Autonomous decision, consistent with the approved SEO/IA documents:
  Home, About, and individual Services/Portfolio/Articles all support
  genuinely localized URL slugs, because they're CMS entries with their
  own per-language url_slug field (Pattern A/B content). But the "hub"
  and utility routes below (Services index, Portfolio index, Resources
  index, Contact, FAQ, Get a Quote, Testimonials) aren't backed by a
  per-locale slug field in the Stage 3 schema — the `pages` collection
  was deliberately scoped to Home/About/Start Here/Legal only.

  Rather than inventing new schema fields for a handful of fixed routes,
  this reuses the simpler fallback the approved IA explicitly sanctioned
  (Section 2: "start simple with identical slugs... migrate later"):
  identical English path segments across both locales for these routes.
  Fully localized versions (e.g. /fr/devis/ instead of /fr/get-a-quote/)
  remain a valid future enhancement, not a blocker.
*/
export const utilityRoutes = {
  services: 'services',
  portfolio: 'portfolio',
  resources: 'resources',
  contact: 'contact',
  faq: 'faq',
  quote: 'get-a-quote',
  testimonials: 'testimonials',
} as const;

export function utilityPath(locale: Locale, route: keyof typeof utilityRoutes, ...rest: string[]) {
  return buildLocalizedPath(locale, utilityRoutes[route], ...rest);
}
