import { getEntry, type CollectionEntry } from 'astro:content';
import type { Locale } from './config';
import { getAlternateLocale } from './utils';

/*
  NOT independently testable outside the Astro build — this file imports
  'astro:content', a virtual module that only exists inside Astro's own
  build process. Everything in here is structurally reviewed, not
  execution-tested, in this environment (see the Stage 4/5 report).
*/

type PairedCollection = 'pages' | 'services' | 'portfolio' | 'testimonials' | 'faqs';

/**
 * Resolves the paired entry in the other locale for any of the five
 * "Pattern A" collections (Pages, Services, Portfolio, Testimonials,
 * FAQs — see the Stage 3 content architecture). These collections use
 * native Decap i18n: an entry's id is "{locale}/{stableSlug}", and the
 * stable slug (the filename) is identical across both locale files by
 * the project's own naming rule — so swapping only the locale segment of
 * the id, not the url_slug, is what correctly finds the pair.
 *
 * Returns null if no pair exists — callers must treat that as "no
 * translation available" and apply a sensible fallback (see
 * LanguageSwitcher.astro), never a hard error.
 */
export async function resolveAlternateEntry<C extends PairedCollection>(
  collection: C,
  currentId: string,
  currentLocale: Locale
): Promise<CollectionEntry<C> | null> {
  const alternateLocale = getAlternateLocale(currentLocale);
  const stableSlug = currentId.split('/').slice(1).join('/');
  if (!stableSlug) return null;
  const alternateId = `${alternateLocale}/${stableSlug}`;

  const entry = await getEntry(collection, alternateId);
  return entry ?? null;
}

/**
 * Resolves the paired entry for an Articles entry, which uses the
 * deliberately different "Pattern B" model (flat collection, no forced
 * locale parity — see Stage 3). An article only has a counterpart when
 * its `translation_of` field has been explicitly filled in; this is
 * expected to be null far more often than the Pattern A resolver above,
 * and that is correct, not an error condition.
 */
export async function resolveAlternateArticle(
  currentEntry: CollectionEntry<'articles'>
): Promise<CollectionEntry<'articles'> | null> {
  const pairedSlug = currentEntry.data.translation_of;
  if (!pairedSlug) return null;

  const { getCollection } = await import('astro:content');
  const allArticles = await getCollection('articles');
  const match = allArticles.find((a) => a.data.url_slug === pairedSlug);
  return match ?? null;
}
