import type { Locale } from './config';

/*
  UI-chrome strings only — NOT content.
  Per the approved technical architecture (Section 6, "Localization
  System"): nav labels, footer text, taglines, and every other piece of
  actual site content lives in the CMS `settings`/`pages`/etc. collections,
  never here. This file holds only the small, non-editorial interface
  strings that no reasonable site owner would want to hunt through a CMS
  to edit — ARIA labels, generic fallback messages, and the like.
*/
const uiStrings = {
  en: {
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skipToContent: 'Skip to main content',
    required: 'Required',
    breadcrumbHome: 'Home',
    translationUnavailable: 'This page is not yet available in French — showing the English version.',
  },
  fr: {
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    skipToContent: 'Aller au contenu principal',
    required: 'Obligatoire',
    breadcrumbHome: 'Accueil',
    translationUnavailable: "Cette page n'est pas encore disponible en français — voici la version anglaise.",
  },
} as const;

export type UiStringKey = keyof (typeof uiStrings)['en'];

export function t(locale: Locale, key: UiStringKey): string {
  return uiStrings[locale][key];
}
