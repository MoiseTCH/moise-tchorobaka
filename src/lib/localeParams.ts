import { locales } from '../i18n/config';

export function getLocaleStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}
