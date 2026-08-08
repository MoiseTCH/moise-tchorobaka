/*
  Dynamic robots.txt, not a static public/ file — deliberate Stage 10 fix.
  A static robots.txt would hardcode the domain a second time, separately
  from astro.config.mjs's `site` value, creating a real risk of the two
  drifting out of sync (e.g. someone updates the production domain in one
  place and forgets the other). Deriving the sitemap URL from Astro.site
  here means there is exactly one place the domain is configured for the
  whole SEO system — see the Stage 8/9 report's "Production Domain"
  section, now simplified to a single value.
*/
import type { APIContext } from 'astro';

export async function GET({ site }: APIContext) {
  const siteUrl = site ? site.href.replace(/\/$/, '') : '';
  const body = `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
