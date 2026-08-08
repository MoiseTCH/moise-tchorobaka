import { defineCollection, z } from 'astro:content';

/*
  Content Collections — Moïse Tchorobaka
  ========================================
  This file is the type-safe half of a single contract; admin/config.yml
  is the other half. Every field name and shape here must match a Decap
  field exactly — if the two ever diverge, that is treated as a bug.

  ---------------------------------------------------------------------
  DECISION: relation fields are plain strings, not Astro's reference()
  ---------------------------------------------------------------------
  Astro's built-in `reference()` helper validates a field against another
  collection's *entry id*. In this project, an entry's id includes its
  locale prefix (e.g. "en/translation-localization" or
  "fr/traduction-localisation" — note the id is derived from the file's
  path, not the translated url_slug). A relation field like a portfolio
  item's `service_category` needs to point at "the Translation service"
  regardless of which locale is being viewed, and it needs to store the
  *same* value in both the English and French copy of that portfolio
  entry (otherwise switching languages could silently point at a
  different, unrelated service).

  The only value that is guaranteed identical across both locale files
  for a given entry is its filename — which is also stable and
  locale-agnostic by the project's own file-naming rule (see the CMS
  architecture verification: "the filename is a stable internal
  identifier shared across both locale folders"). So relation fields
  here store that stable filename slug as a plain string (e.g.
  "translation-localization"), resolved manually at query time by
  combining it with the current locale (`getEntry('services',
  `${locale}/${storedSlug}`)`), rather than relying on reference()'s
  exact-id matching, which would require the id to already carry a
  locale prefix the relation value doesn't have. This is a deliberate,
  documented trade-off: slightly less automatic validation, in exchange
  for relation values that behave identically no matter which locale is
  open — which matters more for a bilingual site than the validation
  convenience.
*/

// Matches Decap's "Search Engine (SEO)" object-widget grouping exactly —
// the CMS writes these two fields nested under a `seo:` key, not flat at
// the entry's top level, so the schema must nest them the same way or
// every SEO field would fail validation on build.
const seoSchema = z
  .object({
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
  })
  .optional();

// ---------------------------------------------------------------- pages
const pages = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      url_slug: z.string(),
      page_type: z.enum(['home', 'about', 'start_here', 'legal']),
      description: z.string().optional(), // short intro/dek, used above the fold
      hero_heading: z.string().optional(),
      hero_subheading: z.string().optional(),
      featured_image: z.string().optional(), // root-relative path into public/uploads (Decap's media_folder) — plain string, not Astro's image() optimizer, which expects assets colocated with content, not CMS-uploaded public/ files
      image_alt: z.string().optional(),
      social_image: z.string().optional(), // og:image override, falls back to featured_image; same root-relative public/ path reasoning as featured_image
      seo: seoSchema,
    }),
});

// -------------------------------------------------------------- services
const services = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      url_slug: z.string(),
      tier: z.enum(['primary', 'secondary', 'developing']),
      accent_color: z.enum(['cobalt', 'marigold']),
      icon: z.enum(['translation', 'language_training', 'cv_writing', 'website', 'ai_services']),
      short_description: z.string(), // used on Services hub cards
      // NOTE: the service page's main long-form content is NOT declared
      // here — Decap's "Body" field is named `body`, which Astro treats
      // as the file's actual Markdown content (available via entry.render()
      // / <Content />), not a frontmatter key. Declaring it in this schema
      // would be both redundant and incorrect.
      benefits: z.array(z.string()).optional(),
      process_steps: z
        .array(
          z.object({
            step_title: z.string(),
            step_description: z.string(),
          })
        )
        .optional(),
      target_audience: z.array(z.string()).optional(),
      pricing_note: z.string().optional(),
      cta_label: z.string(),
      featured: z.boolean().default(false), // homepage spotlight — distinct from `tier`, which drives nav order
      cross_linked_services: z.array(z.string()).max(2).optional(), // stable slugs — see file-level note
      featured_image: z.string().optional(), // root-relative path into public/uploads (Decap's media_folder) — plain string, not Astro's image() optimizer, which expects assets colocated with content, not CMS-uploaded public/ files
      image_alt: z.string().optional(),
      seo: seoSchema,
    }),
});

// ------------------------------------------------------------- portfolio
const portfolio = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      url_slug: z.string(),
      service_category: z.string(), // stable service slug — see file-level note
      description: z.string(),
      // NOTE: the optional longer write-up ("Body" in Decap) is likewise
      // the file's actual Markdown body, not a schema field — see the
      // matching note in the `services` collection above.
      tools: z.array(z.string()).optional(), // relevant for Website Services items; optional elsewhere
      external_link: z.string().url().optional(),
      client_type: z.string().optional(), // anonymized descriptor
      before_text: z.string().optional(), // used instead of an image for confidential samples
      after_text: z.string().optional(),
      image: z.string().optional(),
      image_alt: z.string().optional(),
      featured: z.boolean().default(false),
      seo: seoSchema,
    }),
});

// -------------------------------------------------------------- articles
// Deliberately flat (no locale sub-folders) — see the earlier-approved
// "flagged independence" model: a French translation is not required
// before an English article can be published, and vice versa.
const articles = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      title: z.string(),
      url_slug: z.string(),
      language: z.enum(['en', 'fr']),
      excerpt: z.string(),
      author: z.string().default('Moïse Tchorobaka'),
      publication_date: z.date(),
      pillar_category: z.enum([
        'translation_nuance',
        'language_learning',
        'career_cv',
        'digital_presence',
        'practical_ai',
      ]),
      related_service: z.string(), // stable service slug — required, drives the mandatory contextual CTA
      translation_of: z.string().optional(), // url_slug of the counterpart article, only once one exists
      featured_image: z.string().optional(), // root-relative path into public/uploads (Decap's media_folder) — plain string, not Astro's image() optimizer, which expects assets colocated with content, not CMS-uploaded public/ files
      image_alt: z.string().optional(),
      seo: seoSchema,
    }),
});

// ---------------------------------------------------------- testimonials
const testimonials = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      client_name: z.string(), // name or initials, per the client's privacy preference
      role: z.string().optional(),
      organization: z.string().optional(),
      service_category: z.string(), // stable service slug — see file-level note
      quote: z.string(),
      photo: z.string().optional(),
      rating: z.number().min(1).max(5).optional(),
      publication_status: z.enum(['draft', 'published']).default('draft'),
    }),
});

// ------------------------------------------------------------------ faqs
const faqs = defineCollection({
  type: 'content',
  schema: () =>
    z.object({
      question: z.string(),
      answer: z.string(),
      is_global: z.boolean().default(true),
      related_service: z.string().optional(), // stable service slug, omitted for genuinely general questions
      order: z.number().default(0), // controls display sequence within a page
    }),
});

// -------------------------------------------------------------- settings
// A singleton, not a repeatable collection — see admin/config.yml, where
// this is defined as a `files` entry rather than a `folder` collection.
const settings = defineCollection({
  type: 'data',
  schema: () =>
    z.object({
      site_name: z.string(),
      descriptor_tagline: z.string(),
      human_tagline: z.string().optional(),
      contact_email: z.string().email(),
      phone: z.string().optional(),
      whatsapp_number: z.string().optional(),
      default_language: z.enum(['en', 'fr']),
      nav_labels: z.object({
        nav_home: z.string(),
        nav_services: z.string(),
        nav_portfolio: z.string(),
        nav_resources: z.string(),
        nav_about: z.string(),
        nav_contact: z.string(),
        nav_quote: z.string(),
      }),
      footer_text: z.string().optional(),
      social_links: z
        .array(
          z.object({
            platform: z.string(),
            url: z.string().url(),
          })
        )
        .optional(),
      seo_defaults: z
        .object({
          default_seo_title: z.string().optional(),
          default_seo_description: z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = {
  pages,
  services,
  portfolio,
  articles,
  testimonials,
  faqs,
  settings,
};
