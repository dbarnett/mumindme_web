'use client';

import { createContext, ReactNode, useState } from "react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { updateSearchParams } from "@/lib/urls";

interface I18nContextType {
  locale: string | null;
  setLocale: (locale: string) => void;
}

export const I18nContext = createContext<I18nContextType>({
  locale: null,
  setLocale: () => {},
});

interface I18nProviderProps {
  locale: string | null;
  children: ReactNode;
}

export default function I18nProvider({ locale, children }: I18nProviderProps) {
  const [stateLocale, setLocaleStr] = useState(locale);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const setLocale = (locale: string) => {
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
}
