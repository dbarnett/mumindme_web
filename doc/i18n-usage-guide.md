# i18n Usage Guide

Quick reference for using the custom i18n implementation in this project.

## Adding a New Translation

1. Add the English string to `lib/app-messages.ts`:

```typescript
const translationMap: TranslationMap = {
  // ... existing translations ...
  'Your new English string here': {
    es: 'Tu nueva cadena en español aquí',
  },
};
```

**Important**: Use the exact string (including punctuation and quotes) that you'll use in your components.

## Using Translations in Server Components

```typescript
import { t } from '@/lib/app-messages';
import { headers } from 'next/headers';

export default async function MyPage() {
  const locale = (await headers()).get('x-selected-locale');

  return (
    <div>
      <h1>{t('Your string here', locale)}</h1>
    </div>
  );
}
```

## Using Translations in Client Components

```typescript
'use client';

import { T } from '@/components/t';

export default function MyComponent() {
  return (
    <div>
      <h1><T>Your string here</T></h1>
    </div>
  );
}
```

## Adding a New Locale

1. Add the locale to `lib/locales.ts`:

```typescript
export const supportedLocales = ['en-US', 'es-MX', 'fr-CA'] as const;
```

2. Add translations for the new locale in `lib/app-messages.ts`:

```typescript
const translationMap: TranslationMap = {
  'Hello': {
    es: 'Hola',
    fr: 'Bonjour',  // Add French
  },
};
```

3. Update the language selector in `components/lang-selector.tsx`:

```typescript
<button onClick={() => setLocale('fr-CA')}>French 🇫🇷</button>
```

## Testing Locale Detection

### Test with URL Parameter

Visit: `http://localhost:3000?hl=es-MX`

### Test with Browser Settings

1. Change your browser's language preferences
2. Visit the site without the `?hl=` parameter
3. The site should detect your browser's preferred language

### Test with curl

```bash
# Test Accept-Language header
curl -H "Accept-Language: es-MX,es;q=0.9" http://localhost:3000

# Test URL parameter
curl http://localhost:3000?hl=es-MX
```

## Common Pitfalls

### Exact String Match Required

Translation keys require **exact** string matching - any difference in characters, whitespace, or punctuation will cause the lookup to fail:

```typescript
// ❌ Wrong - strings don't match exactly
translationMap: {
  "Welcome to our site!": { es: "¡Bienvenido a nuestro sitio!" }
}
<T>Welcome to our site</T>  // Missing exclamation mark - WON'T MATCH!

// ✅ Correct - exact match
translationMap: {
  "Welcome to our site!": { es: "¡Bienvenido a nuestro sitio!" }
}
<T>Welcome to our site!</T>  // Exact match - WORKS!
```

Common mismatches to watch for:
- Different punctuation (e.g., `!` vs `.` vs `?`)
- Different whitespace (trailing spaces, multiple spaces, tabs)
- Different quote/apostrophe characters (e.g., `'` vs `'` vs `'`)
- Different capitalization
- Line breaks or formatting

### Translation Key Not Found

If a translation isn't showing up, check:

1. Is the key **exactly** the same in `app-messages.ts` and your component?
2. Is the locale code correct (e.g., `'es'` not `'es-MX'`)?
3. Are there any hidden characters or formatting differences?

### Client Navigation Locale Issues

If the locale doesn't persist across page navigation:

1. Make sure the URL includes the `?hl=` parameter
2. Check that middleware is setting the `x-selected-locale` header
3. Verify the `I18nProvider` is in the root layout

## URL Parameter Format

The locale can be specified in the URL with the `hl` parameter:

- Full locale: `?hl=es-MX`
- Language only: `?hl=es` (will match to `es-MX`)
- Multiple params: `?hl=es-MX&other=value`

## Programmatic Locale Switching

```typescript
'use client';

import { useContext } from 'react';
import { I18nContext } from '@/components/i18n-provider';

export function MyComponent() {
  const { locale, setLocale } = useContext(I18nContext);

  const switchToSpanish = () => {
    setLocale('es-MX');
  };

  return (
    <button onClick={switchToSpanish}>
      Switch to Spanish (current: {locale})
    </button>
  );
}
```
