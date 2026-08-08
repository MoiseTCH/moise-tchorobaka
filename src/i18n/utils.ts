import { locales, defaultLocale, type Locale } from './config';

/*
  Pure functions only in this file — no imports from 'astro:content' or any
  other Astro-runtime module. That's deliberate: it means this file's logic
  can be genuinely executed and tested with plain Node (see the Stage 4/5
  integration test), rather than only reviewed by eye. Anything that needs
  to query content collections lives in content-pairing.ts instead, which
  is clearly marked as structurally-verified-only, since it cannot run
  outside the actual Astro build.
*/

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Reads the locale segment from a root-relative path, e.g. "/fr/about/" -> "fr". */
export function getLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0];
  return segment && isLocale(segment) ? segment : defaultLocale;
}

/**
 * Returns the other supported locale. Written as a search rather than a
 * hardcoded en<->fr swap so it still behaves correctly if a third locale
 * is ever added — the caller just gets the first locale that isn't the
 * current one, which is exactly "the other one" while there are two.
 */
export function getAlternateLocale(current: Locale): Locale {
  const other = locales.find((l) => l !== current);
  return other ?? defaultLocale;
}

/**
 * Swaps only the locale segment of a path, leaving everything after it
 * untouched — e.g. "/en/faq/" + "fr" -> "/fr/faq/".
 *
 * IMPORTANT LIMITATION, by design: this does NOT know whether the target
 * actually exists in the other language, and it does NOT know that two
 * paired content entries can have *different* url_slug values per
 * language (e.g. "translation-localization" vs "traduction-localisation" —
 * see the Stage 3 content architecture). This helper is only correct for
 * routes whose path segment is identical in both languages by design
 * (e.g. /en/faq/ and /fr/faq/, /en/contact/ and /fr/contact/). For any
 * content-collection entry that may have a differently-localized slug,
 * use resolveAlternateEntry() from content-pairing.ts instead, which
 * looks up the real paired entry rather than guessing from the URL.
 */
export function swapLocaleInPath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }
  return '/' + segments.join('/') + '/';
}

/** Builds a root-relative, locale-prefixed path from segments, e.g. ("fr", "services", "traduction-localisation") -> "/fr/services/traduction-localisation/". */
export function buildLocalizedPath(locale: Locale, ...segments: string[]): string {
  const clean = segments.filter(Boolean).map((s) => s.replace(/^\/|\/$/g, ''));
  return '/' + [locale, ...clean].join('/') + '/';
}
