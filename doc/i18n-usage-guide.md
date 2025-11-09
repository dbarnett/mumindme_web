# i18n Usage Guide

Quick reference for using the custom i18n implementation in this project.

See [`doc/i18n-implementation.md`](./i18n-implementation.md) for architecture details, trade-offs, and design decisions.

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

**Example: Adding Brazilian Portuguese (PT-BR)**

### Step 1: Add to supported locales

```typescript
// lib/locales.ts
export const supportedLocales = ['en-US', 'es-MX', 'pt-BR'] as const;
```

### Step 2: Add translations

```typescript
// lib/app-messages.ts
const translationMap: TranslationMap = {
  'Hello': {
    es: 'Hola',
    pt: 'Olá',  // Note: use language code 'pt', not 'pt-BR'
  },
  'My projects': {
    es: 'Mis proyectos',
    pt: 'Meus projetos',
  },
};
```

**Important:** Translation keys use language code only (`pt`), not full locale (`pt-BR`). The `getLocaleLang()` function extracts `pt` from `pt-BR`.

### Step 3: Update language selector

```typescript
// components/lang-selector.tsx
<button onClick={() => setLocale('pt-BR')}>Português 🇧🇷</button>
```

### Step 4: Test locale detection

```bash
# Test URL parameter
curl http://localhost:3000?hl=pt-BR

# Test Accept-Language header
curl -H "Accept-Language: pt-BR,pt;q=0.9,en;q=0.8" http://localhost:3000
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

## Mixed Language Content

When content is available in one language but not another (e.g., blog post in English, navigation in Spanish), use the `lang` attribute to mark language changes:

```tsx
// app/posts/[id]/page.tsx
export default async function Post({ post }: { post: PostData }) {
  const locale = (await headers()).get('x-selected-locale');

  return (
    <div>
      {/* Navigation in user's preferred language */}
      <nav>
        <Link href="/"><T>Back to home</T></Link>
      </nav>

      {/* Blog post only available in English */}
      <article lang="en">
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
    </div>
  );
}
```

**Why use `lang` attribute:**
- Helps screen readers pronounce text correctly
- Enables browser extensions to detect untranslated sections
- Prepares for future in-page translation features
- Valid on any HTML element per HTML5 spec

**Future extensibility:** The `lang` attribute is designed to support future integration with:
- Client-side translation tools (Google Translate, DeepL)
- Browser extensions for automatic translation
- Custom "Translate this section" UI components

## Translation Coverage Validation

### Check for Missing Translations

```typescript
// scripts/check-translations.ts
import { translationMap } from '@/lib/app-messages';
import { supportedLocales } from '@/lib/locales';

const allKeys = Object.keys(translationMap);
const languages = ['es', 'pt']; // Add new languages here

languages.forEach(lang => {
  const missingKeys = allKeys.filter(key => !translationMap[key]?.[lang]);

  if (missingKeys.length > 0) {
    console.error(`❌ Missing ${lang} translations for:`, missingKeys);
  } else {
    console.log(`✅ All strings translated for ${lang}`);
  }
});
```

**Run validation:**
```bash
npx tsx scripts/check-translations.ts
```

### ESLint Protection

The project has ESLint configured to prevent importing `negotiator` (which breaks Edge Runtime):

```bash
# Run linting before committing
npm run lint
```

If you accidentally import `negotiator`, you'll see:
```
Error: Do not use 'negotiator' - Edge Runtime incompatible. Use 'accept-language-parser'.
```

## Troubleshooting

### Locale Not Detected Correctly

**Symptoms:** Site shows English even though you set `?hl=es-MX`

**Check:**
1. Verify middleware is running: `console.log()` in `middleware.ts`
2. Check headers in server component:
   ```typescript
   const locale = (await headers()).get('x-selected-locale');
   console.log('Detected locale:', locale);
   ```
3. Verify locale is in `supportedLocales` array

### Translation Not Showing

**Symptoms:** See English text instead of Spanish translation

**Check:**
1. **Exact string match:** Translation key must match exactly (including punctuation, whitespace, apostrophes)
2. **Language code:** Use `es` not `es-MX` in translation map
3. **Console check:**
   ```typescript
   console.log('Translation for "My projects":', translationMap['My projects']?.es);
   ```

**Common fixes:**
- Change `'` (right apostrophe) to `'` (straight apostrophe) in both key and usage
- Remove trailing whitespace
- Match punctuation exactly

### Apostrophe Mismatch (Common Issue)

**Problem:** Some tools auto-convert straight apostrophes (`'`) to curly quotes (`'`):

```typescript
// These don't match!
translationMap: {
  "I'm a developer": { es: "Soy desarrollador" }  // straight apostrophe
}
<T>I'm a developer</T>  // curly apostrophe (auto-converted by editor)
```

**Solution:**
1. Search for all usages: `grep -r "I'm" src/`
2. Standardize to straight apostrophes everywhere
3. Configure editor to not auto-convert quotes

### Client Navigation Loses Locale

**Symptoms:** Language resets when navigating between pages

**Check:**
1. Verify `?hl=` parameter is in URL after navigation
2. Check `I18nProvider` is in root layout, not page-specific
3. Verify `setLocale()` calls `router.replace()` with query param

**Debug:**
```typescript
// components/i18n-provider.tsx
const setLocale = (locale: string) => {
  console.log('Setting locale to:', locale);
  setLocaleStr(locale);
  const newParams = updateSearchParams(searchParams, { 'hl': locale });
  console.log('New URL params:', newParams.toString());
  router.replace(`${pathName}?${newParams.toString()}`, { scroll: false });
};
```

## Migration Path: Semantic Translation Keys

**Current (English as keys):**
```typescript
translationMap: {
  'My projects': { es: 'Mis proyectos' }
}
```

**Future (Semantic keys - recommended):**
```typescript
translations: {
  nav: {
    projects: {
      en: 'My projects',
      es: 'Mis proyectos',
      pt: 'Meus projetos'
    }
  }
}

// Usage: t('nav.projects', locale)
```

**Benefits:**
- No apostrophe/whitespace mismatch issues
- TypeScript autocomplete for keys
- Easy to see translation coverage
- Follows i18n library conventions

**When to migrate:** When you have 3+ languages or 50+ strings. For now, English-as-keys is simpler.
