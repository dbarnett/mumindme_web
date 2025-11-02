import Negotiator from 'negotiator';
import { match as matchLocale } from '@formatjs/intl-localematcher';

export const supportedLocales = ['en-US', 'es-MX'] as const;
const DEFAULT_LOCALE = supportedLocales[0];

export type SupportedLocale = (typeof supportedLocales)[number];

export function getLocaleFromHeaders(headers: Headers): string {
  const acceptLanguage = headers.get('accept-language');
  const languages = new Negotiator({
    headers: { 'accept-language': acceptLanguage ?? undefined },
  }).languages();
  // Filter out wildcards and invalid language tags
  const validLanguages = languages.filter(lang => lang !== '*' && /^[a-z]{2,3}(-[A-Z]{2,3})?$/i.test(lang));
  return matchLocale(validLanguages.length > 0 ? validLanguages : [DEFAULT_LOCALE], supportedLocales, DEFAULT_LOCALE);
}

export function getSelectedLocale(headers: Headers): string | null {
  return headers.get('x-selected-locale');
}

export function getLocaleLang(locale: string): string {
  return locale.split(/-/, 2)[0]!;
}
