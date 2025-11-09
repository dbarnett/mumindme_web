import parser from 'accept-language-parser';
import { match as matchLocale } from '@formatjs/intl-localematcher';

export const supportedLocales = ['en-US', 'es-MX'] as const;
const DEFAULT_LOCALE = supportedLocales[0];

export type SupportedLocale = (typeof supportedLocales)[number];

/**
 * Detects the best matching locale from Accept-Language header.
 *
 * Uses accept-language-parser instead of negotiator for Edge Runtime compatibility.
 * The parser properly handles quality values (q=0.9) and returns results sorted by preference.
 *
 * @param headers - Request headers containing accept-language
 * @returns The best matching supported locale, or default locale if none match
 */
export function getLocaleFromHeaders(headers: Headers): string {
  const acceptLanguage = headers.get('accept-language');

  // Parse Accept-Language header (already sorted by quality value)
  const parsedLanguages = parser.parse(acceptLanguage || '');

  // Convert parsed objects to locale strings: {code: "en", region: "US"} -> "en-US"
  const languages = parsedLanguages.map(lang =>
    lang.region ? `${lang.code}-${lang.region}` : lang.code
  );

  // Filter out wildcards and invalid language tags (defensive, parser should handle this)
  const validLanguages = languages.filter(
    lang => lang !== '*' && /^[a-z]{2,3}(-[A-Z]{2,3})?$/i.test(lang)
  );

  try {
    return matchLocale(
      validLanguages.length > 0 ? validLanguages : [DEFAULT_LOCALE],
      supportedLocales,
      DEFAULT_LOCALE
    );
  } catch (error) {
    // If locale matching fails, fall back to default
    return DEFAULT_LOCALE;
  }
}

export function getSelectedLocale(headers: Headers): string | null {
  return headers.get('x-selected-locale');
}

export function getLocaleLang(locale: string): string {
  return locale.split(/-/, 2)[0]!;
}
