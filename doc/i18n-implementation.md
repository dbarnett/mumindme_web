# Next.js Same-URL i18n Implementation

This document describes the custom internationalization (i18n) implementation used in this project and provides a roadmap for extracting it into a standalone, reusable library.

## Overview

This implementation provides i18n for Next.js 15 App Router with the following unique characteristics:

- ✅ **Same URLs for all languages** - No locale prefix in paths (e.g., `/about` not `/en/about`)
- ✅ **No redirects** - Middleware sets headers without URL changes
- ✅ **Client-side language switching** - Instant UI updates via React Context
- ✅ **Browser language detection** - Defaults to user's `Accept-Language` header
- ✅ **URL parameter override** - Explicit language selection via `?hl=es-MX`
- ✅ **Shareable language-specific links** - URLs persist language choice via query params
- ✅ **TypeScript support** - Fully typed with strict mode

### Why This Approach is Unique

**Comparison with existing Next.js i18n libraries:**

| Feature | This Implementation | next-intl | react-i18next | next-i18next |
|---------|---------------------|-----------|---------------|--------------|
| Same URL for all languages | ✅ | ❌ (requires path prefixes) | ❌ | ❌ (Pages Router only) |
| Query parameter locale detection | ✅ (`?hl=es-MX`) | ❌ (cookie-based) | ❌ | ❌ |
| No redirects | ✅ | ❌ | Depends | ❌ |
| Shareable language links | ✅ (via query params) | ⚠️ (cookie = not shareable) | ⚠️ | ⚠️ |
| Edge Runtime compatible | ✅ (after negotiator fix) | ✅ | ✅ | ❌ |

**Key insight:** No major i18n library supports query-parameter-based locale switching with same-URL routing as a primary mechanism. The combination of requirements makes this implementation legitimately unique:

1. **Same URL for all languages** - Most libraries use path prefixes (`/en/about`, `/es/about`)
2. **Query params for language** - Most use cookies or path segments
3. **No redirects** - Most solutions redirect to add locale prefix
4. **Shareable language-specific URLs** - Cookie-based approaches can't share language preference

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
2. **Accept-Language header** - Browser's language preferences, parsed via `accept-language-parser` and matched via `@formatjs/intl-localematcher`
3. **Default locale** - `en-US` if no match found

### Edge Runtime Compatibility

**Critical fix:** Originally used the `negotiator` npm package for parsing Accept-Language headers, but this caused Edge Runtime incompatibility issues:

**Problems with `negotiator`:**
- Returns `["*"]` instead of actual language preferences in Edge Runtime
- Expects Node.js-style header objects, incompatible with Web API `Headers`
- Can cause bundler confusion leading to circular dependencies
- Works in local dev (Node.js) but fails in production (Vercel Edge Runtime)

**Solution:** Replaced with `accept-language-parser` package:
- **Smaller bundle**: 13.6 kB vs 28.7 kB (53% reduction)
- **Edge Runtime compatible**: Uses standard Web APIs
- **Focused functionality**: Purpose-built for Accept-Language parsing only
- **Quality value handling**: Properly parses `q=0.9` values and sorts by preference

**Implementation:**
```typescript
// lib/locales.ts
import parser from 'accept-language-parser';

const parsedLanguages = parser.parse(acceptLanguage || '');
// Returns: [{ code: "en", region: "US", quality: 1.0 }, ...]

const languages = parsedLanguages.map(lang =>
  lang.region ? `${lang.code}-${lang.region}` : lang.code
);
```

**Protection against regression:**
- ESLint rule prevents importing `negotiator` with clear error message
- `npm run lint` catches violations before commit
- See `.eslintrc.json` for configuration

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

## SEO Considerations and Trade-offs

### Query Parameter Approach (`?hl=es-MX`) vs Path-Based (`/es/about`)

**This implementation's approach:**
```
https://mumind.me/about?hl=es-MX
https://mumind.me/about?hl=en-US
```

**Path-based approach:**
```
https://mumind.me/en/about
https://mumind.me/es/about
```

### SEO Impact

| Aspect | Query Params (`?hl=`) | Path-Based (`/es/`) |
|--------|----------------------|---------------------|
| **Google indexing** | ❌ Treats as same URL | ✅ Indexes separately |
| **`hreflang` tags** | ⚠️ May be ignored | ✅ Fully supported |
| **Locale-specific ranking** | ❌ Limited | ✅ Strong |
| **Implementation complexity** | ✅ Simple | ❌ Complex routing |
| **Shareable links** | ✅ Works perfectly | ✅ Works perfectly |
| **URL aesthetics** | ⚠️ Query string visible | ✅ Clean paths |

**Reality check:** For this personal blog, the SEO hit is **minimal** because:

1. **Niche content** - Software engineering blog with specific audience
2. **Traffic sources** - Most readers come from direct links, social media, RSS, not Google
3. **Bilingual audience** - Readers who want Spanish content will find it regardless
4. **Small scale** - Personal site, not enterprise e-commerce

### Mitigation Strategy

You can still use `hreflang` tags with query parameters (Google *may* respect these):

```html
<!-- app/layout.tsx or metadata -->
<link rel="alternate" hreflang="en" href="https://mumind.me?hl=en-US" />
<link rel="alternate" hreflang="es" href="https://mumind.me?hl=es-MX" />
<link rel="alternate" hreflang="pt-BR" href="https://mumind.me?hl=pt-BR" />
<link rel="alternate" hreflang="x-default" href="https://mumind.me" />
```

### When to Use Path-Based Instead

Consider switching to path-based routing if:
- SEO is critical to your business model (e-commerce, SaaS marketing)
- You need locale-specific Google Search Console data
- You want different content per locale (not just translations)
- You need to comply with regional regulations per URL

### When Query Params Are Better

Stick with query params if:
- ✅ Implementation simplicity is important
- ✅ Content is the same across languages (pure translations)
- ✅ Users share links frequently (query params preserve language choice)
- ✅ You want the same canonical URL for all languages

## Testing Strategy

A multi-layered approach to catch issues before production:

### Layer 1: Static Analysis (Prevents Regressions at Build Time)

**Circular Dependency Detection with `madge`:**

```bash
npm install --save-dev madge
```

**Package.json scripts:**
```json
{
  "scripts": {
    "check-cycles": "madge --circular --extensions ts,tsx --ts-config ./tsconfig.json .",
    "check-cycles:fail": "madge --circular --extensions ts,tsx --ts-config ./tsconfig.json --warning .",
    "visualize-deps": "madge --image graph.svg --extensions ts,tsx ."
  },
  "madge": {
    "detectiveOptions": {
      "ts": { "skipTypeImports": true },
      "tsx": { "skipTypeImports": true }
    }
  }
}
```

**Why skip type imports:** Type-only imports don't cause runtime circular dependencies, preventing false positives.

**ESLint Integration (Alternative):**

```bash
npm install --save-dev eslint-plugin-import
```

```json
// .eslintrc.json
{
  "plugins": ["import"],
  "rules": {
    "import/no-cycle": ["error", { "maxDepth": 10 }]
  }
}
```

**Prevents `negotiator` regression:**

Already configured in `.eslintrc.json`:
```json
{
  "rules": {
    "no-restricted-imports": ["error", {
      "paths": [{
        "name": "negotiator",
        "message": "Do not use 'negotiator' - Edge Runtime incompatible. Use 'accept-language-parser'."
      }]
    }]
  }
}
```

### Layer 2: Unit Tests (Logic Validation)

**Recommended setup:** Vitest (better Edge Runtime support than Jest)

```bash
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react
```

**Test structure:**
```
tests/
├── unit/
│   ├── lib/
│   │   ├── locales.test.ts        # Locale detection logic
│   │   ├── app-messages.test.ts   # Translation lookup
│   │   └── urls.test.ts           # URL param manipulation
│   └── components/
│       ├── i18n-provider.test.tsx # Context state management
│       └── t.test.tsx              # Translation component
├── integration/
│   └── e2e/                        # Playwright tests for middleware
```

**Critical tests for `lib/locales.ts`:**

```typescript
import { describe, it, expect } from 'vitest';
import { getLocaleFromHeaders } from '@/lib/locales';

describe('getLocaleFromHeaders', () => {
  it('respects quality values (q=) in Accept-Language', () => {
    const headers = new Headers({
      'accept-language': 'es-ES;q=0.9,es-MX;q=0.7,en;q=0.5'
    });
    const locale = getLocaleFromHeaders(headers);
    // Should match es-MX (closest supported to es-ES)
    expect(locale).toBe('es-MX');
  });

  it('handles wildcard and invalid tags gracefully', () => {
    const headers = new Headers({ 'accept-language': '*,invalid-tag' });
    expect(getLocaleFromHeaders(headers)).toBe('en-US'); // default
  });

  it('falls back to default when no valid languages', () => {
    const headers = new Headers({ 'accept-language': '*' });
    expect(getLocaleFromHeaders(headers)).toBe('en-US');
  });
});
```

**Note on middleware testing:** Direct middleware testing is difficult (Edge Runtime simulation). Instead:
- Unit test pure functions (`getLocaleFromHeaders`, `t()`)
- E2E test full flow with Playwright

### Layer 3: Type Safety (Prevents Runtime Errors)

**Stricter TypeScript for translation keys:**

```typescript
// lib/app-messages.ts
const translationMap = {
  'My projects': { es: 'Mis proyectos' },
  'Recent posts': { es: 'Entradas recientes' },
} as const;

type TranslationKey = keyof typeof translationMap;

export function tSafe(message: TranslationKey, locale: string | null): string {
  return translationMap[message]?.[getLocaleLang(locale ?? 'en')] ?? message;
}

// TypeScript will error for invalid keys:
// tSafe('Invalid key', 'en') // ❌ Type error
```

### Layer 4: Pre-commit Hooks (Force Checks)

```bash
npm install --save-dev husky lint-staged
npx husky init
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --max-warnings=0",
      "madge --circular --extensions ts,tsx --ts-config ./tsconfig.json --warning"
    ]
  }
}
```

```bash
# .husky/pre-commit
npm run check-cycles:fail
npm run lint
npm run test
```

**This prevents committing code with circular dependencies or Edge Runtime incompatibilities.**

### Layer 5: CI/CD (Catch Before Deploy)

```yaml
# .github/workflows/test.yml
name: Test & Lint
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run check-cycles:fail  # Fail CI if cycles exist
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build  # Catch build-time errors
```

### Coverage Targets

| Layer | Target | Priority |
|-------|--------|----------|
| Pure functions (`lib/*`) | 95%+ | High - critical logic |
| React components | 70%+ | Medium - focus on state logic |
| Middleware | E2E only | Low - too hard to unit test Edge |
| Type coverage | 100% | High - enforce `strict: true` |

### Real-World Testing

Before deploying:
1. **Local**: Test with `npm run build && npm start` (simulates production)
2. **Preview**: Deploy to Vercel preview environment
3. **Production**: Canary deploy to small percentage of traffic

## Future Improvements and TODOs

### Translation Key Structure Evolution

**Current approach:** English strings as keys
```typescript
const translationMap = {
  'My projects': { es: 'Mis proyectos' },
  'Recent posts': { es: 'Entradas recientes' },
};
```

**Problem:** Character mismatches break lookups (apostrophe types, whitespace, etc.)

**Recommended migration:** Semantic keys with language-last structure

```typescript
// Preferred: nav.projects.en (key first, language last)
const translations = {
  nav: {
    projects: {
      en: 'My projects',
      es: 'Mis proyectos',
      'pt-BR': 'Meus projetos'
    },
    recentPosts: {
      en: 'Recent posts',
      es: 'Entradas recientes',
      'pt-BR': 'Posts recentes'
    }
  },
  home: {
    greeting: {
      en: "I'm a software engineer and explorer.",
      es: 'Soy ingeniero de software y explorador.',
      'pt-BR': 'Sou engenheiro de software e explorador.'
    }
  }
};

// Usage: t('nav.projects', locale)
```

**Benefits:**
- ✅ No character mismatch issues
- ✅ TypeScript autocomplete for keys
- ✅ Easy to see missing translations
- ✅ Conventional structure familiar to i18n library users

**Migration strategy:**
1. Create `lib/translations.ts` with new structure
2. Implement `t(key, locale)` function that walks the nested object
3. Gradually migrate from `app-messages.ts`
4. Add validation script to detect missing translations

### Markdown Post Translation Strategy

**File-based approach for blog posts:**

```
posts/
├── basic-website-i18n.en.md
├── basic-website-i18n.es.md
├── basic-website-i18n.pt-BR.md    # Brazilian Portuguese
├── revamped-website.en.md
└── revamped-website.es.md         # (missing pt-BR)
```

**Implementation:**
```typescript
// lib/posts.ts
export function getPostData(id: string, locale: string) {
  // Try locale-specific version first
  const localizedPath = `posts/${id}.${locale}.md`;
  if (fs.existsSync(localizedPath)) {
    return { ...parseMarkdown(localizedPath), isTranslated: true };
  }

  // Fall back to English
  const englishPath = `posts/${id}.en.md`;
  return {
    ...parseMarkdown(englishPath),
    isTranslated: false,  // Flag for UI to show translation notice
    originalLocale: 'en'
  };
}
```

### Mixed Language Content Support

**Design principle:** Prepare for future extensibility without implementing full solution now.

**Approach:** Use `lang` attribute to mark language changes

```tsx
// Current: Blog post in English with Spanish navigation
<html lang={getLocaleLang(locale)}>  {/* Parent language */}
  <body>
    <nav>
      <T>Recent posts</T>  {/* Spanish: "Entradas recientes" */}
    </nav>

    <article lang="en">  {/* Explicitly mark English content */}
      <h1>My Blog Post Title</h1>
      <p>This post is only available in English...</p>
    </article>
  </body>
</html>
```

**Future extensibility hooks:**

1. **Manual translation trigger:**
```tsx
// components/TranslatableSection.tsx (not yet implemented)
'use client';

export function TranslatableSection({
  children,
  contentLang,
  fallbackTranslation
}: {
  children: ReactNode;
  contentLang: string;
  fallbackTranslation?: ReactNode;
}) {
  const { locale } = useContext(I18nContext);
  const needsTranslation = locale && getLocaleLang(locale) !== contentLang;

  return (
    <div lang={contentLang}>
      {children}
      {/* Future: Add "Translate this section" button */}
      {needsTranslation && fallbackTranslation && (
        <details>
          <summary>Ver traducción automática</summary>
          {fallbackTranslation}
        </details>
      )}
    </div>
  );
}
```

2. **Browser extension integration:**
- `lang` attributes enable browser extensions or user scripts to detect untranslated sections
- Could integrate with Google Translate API, DeepL, or other services
- User can install extension to automatically offer translation of `lang="en"` sections when viewing in Spanish

3. **Translation coverage dashboard:**
```typescript
// Future: scripts/translation-coverage.ts
// Scans all content, reports what's available in each language
// Example output:
// Blog posts: 10 en, 6 es, 2 pt-BR
// UI strings: 100% en, 95% es, 80% pt-BR
```

**HTML5 validation:** `lang` attribute is valid on any HTML element, so this approach is spec-compliant.

### Adding Brazilian Portuguese (PT-BR)

**Status:** Planned, not yet implemented

**Required changes:**

1. **Add to supported locales:**
```typescript
// lib/locales.ts
export const supportedLocales = ['en-US', 'es-MX', 'pt-BR'] as const;
```

2. **Add translations:**
```typescript
// lib/app-messages.ts (or future lib/translations.ts)
const translationMap = {
  'My projects': {
    es: 'Mis proyectos',
    pt: 'Meus projetos'  // pt-BR uses 'pt' key (language code only)
  },
};
```

3. **Update language selector:**
```tsx
// components/lang-selector.tsx
<button onClick={() => setLocale('pt-BR')}>Português 🇧🇷</button>
```

4. **Create PT-BR markdown files:**
```bash
# For each post with translation:
posts/basic-website-i18n.pt-BR.md
```

**Translation priorities (most visible to least visible):**
1. Navigation UI (lang-selector, nav links)
2. Homepage greeting
3. Blog post titles in post list
4. Full blog post content (lowest priority, highest effort)

### i18n Library Alternatives Analysis

**Current implementation:** Simple key-value lookup (~40 lines)

**When to migrate:**

| Feature Needed | Recommended Library | Bundle Size |
|---------------|---------------------|-------------|
| Current usage (simple strings) | **Keep custom** | ~1-2 kB |
| Add interpolation (`Hello {{name}}`) | Rosetta | 0.3 kB |
| Add plurals (`{{count}} items`) | LinguiJS | 10.4 kB |
| Need ICU MessageFormat | FormatJS/react-intl | ~17 kB |
| Need everything + plugins | i18next | ~22 kB |

**Verdict:** Keep current implementation until you need interpolation or plurals. The 10-20x bundle size increase isn't worth it for static strings.

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
