/*
  Hand-written sitemap, replacing @astrojs/sitemap (see astro.config.mjs
  for why — it crashed the real build twice at the same internal location).
  Modeled on robots.txt.ts's already-proven dynamic-endpoint pattern.
  Lists every real public page: static utility routes, plus every entry
  in the content-backed collections. Admin and drafts are never included,
  since this only ever reads from what the site itself actually renders.
*/
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { locales } from '../i18n/config';
import { buildLocalizedPath } from '../i18n/utils';
import { utilityRoutes } from '../lib/routes';

export async function GET({ site }: APIContext) {
  const base = site ? site.href.replace(/\/$/, '') : '';
  const urls = new Set<string>();

  for (const locale of locales) {
    urls.add(buildLocalizedPath(locale));
    for (const route of Object.keys(utilityRoutes) as (keyof typeof utilityRoutes)[]) {
      urls.add(buildLocalizedPath(locale, utilityRoutes[route]));
    }
  }

  const pages = await getCollection('pages');
  for (const entry of pages) {
    const locale = entry.id.split('/')[0];
    if (entry.data.page_type === 'legal') {
      urls.add(buildLocalizedPath(locale as (typeof locales)[number], 'legal', entry.data.url_slug));
    } else if (entry.data.page_type === 'about') {
      urls.add(buildLocalizedPath(locale as (typeof locales)[number], entry.data.url_slug));
    }
    // "home" and "start_here" page_types are covered by the static
    // routes above already, so intentionally not duplicated here.
  }

  const services = await getCollection('services');
  for (const entry of services) {
    const locale = entry.id.split('/')[0];
    urls.add(buildLocalizedPath(locale as (typeof locales)[number], 'services', entry.data.url_slug));
  }

  const portfolioItems = await getCollection('portfolio');
  for (const entry of portfolioItems) {
    const locale = entry.id.split('/')[0];
    urls.add(buildLocalizedPath(locale as (typeof locales)[number], 'portfolio', entry.data.url_slug));
  }

  const articles = await getCollection('articles');
  for (const entry of articles) {
    urls.add(buildLocalizedPath(entry.data.language, 'resources', entry.data.url_slug));
  }

  const urlEntries = [...urls]
    .sort()
    .map((path) => `  <url><loc>${base}${path}</loc></url>`)
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
