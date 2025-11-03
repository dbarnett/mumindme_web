# Next.js Same-URL i18n Implementation

This document describes the custom internationalization (i18n) implementation used in this project and provides a roadmap for extracting it into a standalone, reusable library.

## Overview

This implementation provides i18n for Next.js 15 App Router with the following unique characteristics:

- ✅ **Same URLs for all languages** - No locale prefix in paths (e.g., `/about` not `/en/about`)
- ✅ **No redirects** - Middleware sets headers without URL changes
- ✅ **Client-side language switching** - Instant UI updates via React Context
- ✅ **Browser language detection** - Defaults to user's `Accept-Language` header
- ✅ **URL parameter override** - Explicit language selection via `?hl=es-MX`
- ✅ **TypeScript support** - Fully typed with strict mode

## Architecture

### Files Involved

1. **`middleware.ts`** - Detects locale from URL params or headers, sets custom header
2. **`lib/locales.ts`** - Locale detection logic, supported locales configuration
3. **`lib/app-messages.ts`** - Translation mapping and `t()` function
4. **`components/i18n-provider.tsx`** - React Context provider for client-side locale state
5. **`components/t.tsx`** - Translation component for React children
6. **`components/lang-selector.tsx`** - UI component for language switching
7. **`lib/urls.ts`** - URL parameter manipulation utilities
8. **`app/layout.tsx`** - Root layout that reads locale from headers and provides context

### Data Flow

```
Request → Middleware → Header (x-selected-locale) → Server Component → I18nProvider → Client Components
              ↓                                             ↓
         ?hl param                                    React Context
              ↓                                             ↓
    Accept-Language header                          setLocale() updates
```

#### Server-Side (Middleware)

1. Request arrives with optional `?hl=` parameter
2. Middleware checks `?hl=` param against supported locales
3. Falls back to `Accept-Language` header negotiation
4. Sets `x-selected-locale` header on request
5. Passes request to Next.js with modified headers (no redirect)

#### Server Component Rendering

1. Server components read `x-selected-locale` from `headers()`
2. Pass locale to translation function `t(message, locale)`
3. Pass locale prop to `I18nProvider`

#### Client-Side (React Context)

1. `I18nProvider` maintains locale state initialized from server prop
2. Provides `setLocale()` function via React Context
3. Language switcher calls `setLocale('es-MX')`
4. `setLocale()` updates both:
   - Local state (for immediate UI update)
   - URL query param via `router.replace()` (for persistence)
5. Client components use `<T>` component or `useContext(I18nContext)` for translations

## Implementation Details

### Locale Detection Priority

1. **URL parameter** (`?hl=es-MX`) - Exact match or language match (e.g., `?hl=es` → `es-MX`)
2. **Accept-Language header** - Browser's language preferences, negotiated via `@formatjs/intl-localematcher`
3. **Default locale** - `en-US` if no match found

### Translation System

- Simple key-value lookup in `lib/app-messages.ts`
- Keys are the English strings themselves (no separate key IDs)
- Language-specific translations keyed by language code (e.g., `'es'` not `'es-MX'`)
- Falls back to English if translation not found

### State Management

- **Server state**: Locale from headers, read once per request
- **Client state**: `useState(locale)` in `I18nProvider`, synced with URL
- **Critical**: State initialized from server prop, but not synced on prop changes (potential issue for client-side navigation)

## Known Issues & Limitations

### Current Bugs

1. **Client navigation may not update locale** - When navigating between pages using client-side routing, the locale prop changes from the server but `useState(locale)` doesn't react to prop changes. This was the original issue that led to multiple fix attempts.

2. **Prop/state synchronization** - Several approaches were tried:
   - ❌ `setState` during render → infinite loop in production
   - ❌ `useEffect` sync → flickering UI
   - ✅ Current: No sync, relies on initial state only

3. **Potential apostrophe mismatch** - Right single quotation mark (`'`) vs straight apostrophe (`'`) must match between translation keys and usage sites.

### Limitations

- No pluralization support
- No date/time formatting
- No number formatting
- No nested translations
- No namespaces or context separation
- Translation keys must be exact string matches (including apostrophes, quotes, whitespace)

## Testing Strategy

To make this production-ready and extractable, comprehensive tests are needed:

### Unit Tests

1. **`lib/locales.ts`**
   - `getLocaleFromHeaders()` with various `Accept-Language` values
   - Wildcard (`*`) filtering
   - Invalid language tag filtering
   - Exact locale match (e.g., `en-US`)
   - Language-only match (e.g., `en` → `en-US`)
   - Fallback to default locale

2. **`lib/app-messages.ts`**
   - `t()` function with existing translations
   - `t()` function with missing translations (fallback)
   - `getLocaleLang()` extraction (`'es-MX'` → `'es'`)
   - Apostrophe handling in translation keys

3. **`lib/urls.ts`**
   - `updateSearchParams()` with new params
   - `updateSearchParams()` with unchanged params (identity check)
   - Multiple param updates

4. **`components/i18n-provider.tsx`**
   - Initial locale state from prop
   - `setLocale()` updates context value
   - `setLocale()` updates URL
   - Client navigation locale persistence

### Integration Tests

1. **Middleware behavior**
   - Request with `?hl=es-MX` sets correct header
   - Request with `?hl=es` matches to `es-MX`
   - Request with `Accept-Language: es` sets correct header
   - Request with no params uses default locale

2. **End-to-end locale switching**
   - Click language switcher
   - Verify URL updates
   - Verify translations update
   - Navigate to another page
   - Verify locale persists

3. **Server-side rendering**
   - Page renders with correct locale from headers
   - Metadata uses correct translations

## Extraction Plan: Standalone Library

### Package Name Ideas

- `next-same-url-i18n`
- `next-querystring-i18n`
- `next-transparent-i18n`
- `next-no-redirect-i18n`

### Package Structure

```
next-same-url-i18n/
├── package.json
├── tsconfig.json
├── src/
│   ├── middleware.ts        # Middleware factory
│   ├── server.ts             # Server-side utilities (getLocale, t)
│   ├── client.tsx            # Client components (Provider, useLocale, T)
│   ├── config.ts             # Configuration types
│   └── index.ts              # Public API exports
├── tests/
│   ├── middleware.test.ts
│   ├── server.test.ts
│   ├── client.test.tsx
│   └── integration.test.ts
├── examples/
│   └── basic-nextjs/         # Example Next.js app
└── README.md
```

### API Design

#### Configuration

```typescript
// next-i18n.config.ts
import { defineConfig } from 'next-same-url-i18n';

export default defineConfig({
  locales: ['en-US', 'es-MX', 'fr-CA'],
  defaultLocale: 'en-US',

  // How to detect locale
  detection: {
    queryParam: 'hl',           // Default: 'hl'
    headerName: 'x-locale',     // Default: 'x-selected-locale'
    cookieName: 'locale',       // Optional: persist in cookie
  },

  // Translation loading
  translations: {
    loader: 'file',              // 'file' | 'inline' | 'remote'
    path: './translations',      // For file loader
  },
});
```

#### Middleware

```typescript
// middleware.ts
import { createMiddleware } from 'next-same-url-i18n/middleware';
import config from './next-i18n.config';

export default createMiddleware(config);
```

#### Server Components

```typescript
// app/page.tsx
import { getLocale, t } from 'next-same-url-i18n/server';

export default async function Page() {
  const locale = await getLocale();

  return (
    <div>
      <h1>{t('welcome.title', locale)}</h1>
      <p>{t('welcome.description', locale)}</p>
    </div>
  );
}
```

#### Client Components

```typescript
// app/layout.tsx
import { I18nProvider } from 'next-same-url-i18n/client';
import { getLocale } from 'next-same-url-i18n/server';

export default async function Layout({ children }) {
  const locale = await getLocale();

  return (
    <I18nProvider locale={locale}>
      {children}
    </I18nProvider>
  );
}

// components/LanguageSwitcher.tsx
'use client';

import { useLocale, useSetLocale } from 'next-same-url-i18n/client';

export function LanguageSwitcher() {
  const locale = useLocale();
  const setLocale = useSetLocale();

  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en-US">English</option>
      <option value="es-MX">Español</option>
    </select>
  );
}

// components/Greeting.tsx
'use client';

import { T } from 'next-same-url-i18n/client';

export function Greeting() {
  return <h1><T>Hello, world!</T></h1>;
}
```

#### Translation Files

```json
// translations/en-US.json
{
  "welcome.title": "Welcome",
  "welcome.description": "This is a multilingual site"
}

// translations/es-MX.json
{
  "welcome.title": "Bienvenido",
  "welcome.description": "Este es un sitio multilingüe"
}
```

### Publishing Checklist

- [ ] Set up npm package with TypeScript
- [ ] Implement core functionality
- [ ] Write comprehensive test suite (Jest + React Testing Library)
- [ ] Set up CI/CD (GitHub Actions)
- [ ] Write detailed README with examples
- [ ] Create example Next.js project
- [ ] Add JSDoc comments for all public APIs
- [ ] Generate API documentation (TypeDoc)
- [ ] Publish to npm
- [ ] Create GitHub repository with good README
- [ ] Add badges (build status, coverage, npm version)

### Integration Back Into This Project

Once the library is published:

1. Install package: `npm install next-same-url-i18n`
2. Create `next-i18n.config.ts` with current locales
3. Replace custom middleware with library middleware
4. Migrate translations from `lib/app-messages.ts` to translation files
5. Replace `I18nProvider` with library's provider
6. Replace `<T>` component with library's component
7. Remove custom i18n files (keep translations only)
8. Update imports throughout the codebase

### Benefits of Extraction

1. **Reusability** - Use in other Next.js projects
2. **Testing** - Comprehensive test suite maintained separately
3. **Community** - Others can contribute improvements
4. **Maintenance** - Centralized bug fixes and features
5. **Documentation** - Dedicated docs and examples
6. **Versioning** - Semantic versioning for changes

## Alternative: Keep It Simple

Given the simplicity of the current implementation (~150 LOC), an alternative approach is:

1. Add tests to current implementation in this project
2. Document it thoroughly (this file)
3. Copy/paste into other projects as needed
4. Only extract to library if you have 3+ projects using it

The overhead of maintaining a separate npm package may not be worth it for a personal blog unless you plan to use it across many projects or want to open-source it as a learning experience.

## Recommended Next Steps

1. **Immediate**: Add this doc to `.gitignore` pattern or ensure `doc/` isn't served by Next.js
2. **Short-term**: Test the current implementation on Vercel to confirm it works
3. **Medium-term**: If bugs persist, add targeted tests for the failing scenarios
4. **Long-term**: If you build 2+ more Next.js sites, extract to library

## Resources

- [Next.js 15 App Router Docs](https://nextjs.org/docs/app)
- [next-intl (for comparison)](https://next-intl.dev/)
- [BCP 47 Language Tags](https://www.rfc-editor.org/info/bcp47)
- [Accept-Language Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
- [Intl.LocaleMatcher](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/LocaleMatcher)
