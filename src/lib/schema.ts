import type { CollectionEntry } from 'astro:content';

/*
  Every function here builds structured data strictly from real content
  already displayed on the page — no invented ratings, reviews, prices,
  or credentials. Where genuine data doesn't exist yet (e.g. testimonial
  ratings — zero testimonials currently exist), the corresponding schema
  is simply not emitted, per the explicit instruction not to fabricate.
*/

export function personSchema(siteName: string, siteUrl: string, descriptor: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteName,
    url: siteUrl,
    jobTitle: descriptor,
  };
}

export function websiteSchema(siteName: string, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
  };
}

export function serviceSchema(entry: CollectionEntry<'services'>, siteUrl: string, providerName: string, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: entry.data.title,
    description: entry.data.short_description,
    url: pageUrl,
    provider: {
      '@type': 'Person',
      name: providerName,
      url: siteUrl,
    },
  };
}

export function articleSchema(entry: CollectionEntry<'articles'>, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: entry.data.title,
    description: entry.data.excerpt,
    datePublished: entry.data.publication_date.toISOString(),
    author: {
      '@type': 'Person',
      name: entry.data.author,
    },
    url: pageUrl,
  };
}

export function breadcrumbSchema(items: { label: string; href?: string }[], siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    // Mirrors exactly what the visible Breadcrumbs component renders —
    // structured data must match visible content, not add to it.
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, siteUrl).href } : {}),
    })),
  };
}

export function faqPageSchema(faqs: CollectionEntry<'faqs'>[]) {
  if (faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    // One-to-one with the visible FAQItem list on the page — never a
    // superset of what a visitor can actually read.
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.data.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.data.answer,
      },
    })),
  };
}
