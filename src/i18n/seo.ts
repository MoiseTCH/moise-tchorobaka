import { locales, defaultLocale, type Locale } from './config';

export interface HreflangLink {
  hreflang: string;
  href: string;
}

/**
 * Builds the reciprocal hreflang link set for a page, plus an x-default
 * pointing at the site's default locale. Only emits a link for a locale
 * that actually has a known URL — a missing entry (e.g. an article with
 * no French translation yet) correctly produces no hreflang claim for
 * that locale, rather than a broken or guessed one.
 */
export function buildHreflangLinks(urlsByLocale: Partial<Record<Locale, string>>): HreflangLink[] {
  const links: HreflangLink[] = [];
  for (const locale of locales) {
    const url = urlsByLocale[locale];
    if (url) links.push({ hreflang: locale, href: url });
  }
  const defaultUrl = urlsByLocale[defaultLocale];
  if (defaultUrl) links.push({ hreflang: 'x-default', href: defaultUrl });
  return links;
}
