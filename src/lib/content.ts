import { getCollection } from 'astro:content';
import type { Locale } from '../i18n/config';

/*
  Centralizing collection queries here means every page fetches content
  the same way, and a query rule (e.g. "only published testimonials")
  only needs to be correct in one place.
*/

const TIER_ORDER = { primary: 0, secondary: 1, developing: 2 } as const;

export async function getServicesByLocale(locale: Locale) {
  const all = await getCollection('services', (e) => e.id.startsWith(`${locale}/`));
  return [...all].sort((a, b) => TIER_ORDER[a.data.tier] - TIER_ORDER[b.data.tier]);
}

export async function getPublishedTestimonials(locale: Locale, serviceSlug?: string) {
  const all = await getCollection(
    'testimonials',
    (e) => e.id.startsWith(`${locale}/`) && e.data.publication_status === 'published'
  );
  return serviceSlug ? all.filter((t) => t.data.service_category === serviceSlug) : all;
}

export async function getFaqs(locale: Locale, options: { globalOnly?: boolean; serviceSlug?: string } = {}) {
  const all = await getCollection('faqs', (e) => e.id.startsWith(`${locale}/`));
  let filtered = all;
  if (options.serviceSlug) {
    filtered = filtered.filter((f) => f.data.related_service === options.serviceSlug);
  } else if (options.globalOnly) {
    filtered = filtered.filter((f) => f.data.is_global);
  }
  return filtered.sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedPortfolio(locale: Locale, limit = 3) {
  const all = await getCollection('portfolio', (e) => e.id.startsWith(`${locale}/`) && e.data.featured);
  return all.slice(0, limit);
}

export async function getPortfolioByLocale(locale: Locale) {
  return getCollection('portfolio', (e) => e.id.startsWith(`${locale}/`));
}

export async function getRecentArticles(locale: Locale, limit = 3) {
  const all = await getCollection('articles', (e) => e.data.language === locale);
  return [...all].sort((a, b) => b.data.publication_date.valueOf() - a.data.publication_date.valueOf()).slice(0, limit);
}

export async function getArticlesByLocale(locale: Locale) {
  const all = await getCollection('articles', (e) => e.data.language === locale);
  return [...all].sort((a, b) => b.data.publication_date.valueOf() - a.data.publication_date.valueOf());
}
