'use client';

import { createContext, useState } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { updateSearchParams } from "@/lib/urls";

export const I18nContext = createContext({
  locale: null,
  setLocale: () => {},
});

export default function I18nProvider({ locale, children }) {
  const [stateLocale, setLocaleStr] = useState(locale);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  // Sync locale prop changes from server with state
  if (locale !== stateLocale) {
    setLocaleStr(locale);
  }
  const setLocale = (locale) => {
    setLocaleStr(locale);
    const newParams = updateSearchParams(searchParams, { 'hl': locale });
    if (newParams !== searchParams) {
      router.replace(
        `${pathName}?${newParams.toString()}`,
        { scroll: false });
    }
  };

  return (
    <I18nContext.Provider value={{ locale: stateLocale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
};
