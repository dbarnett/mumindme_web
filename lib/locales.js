import Negotiator from 'negotiator';
import { match as matchLocale } from '@formatjs/intl-localematcher';

export const supportedLocales = ['en-US', 'es-MX'];

export function getLocaleFromHeaders(headers) {
  const acceptLanguage = headers.get('accept-language');
  const languages = new Negotiator({
    headers: { 'accept-language': acceptLanguage },
  }).languages();
  return matchLocale(languages, supportedLocales, supportedLocales[0]);
}

export function getSelectedLocale(headers) {
  return headers.get('x-selected-locale');
}

export function getLocaleLang(locale) {
  return locale.split(/-/, 2)[0];
}
