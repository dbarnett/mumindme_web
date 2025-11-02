'use client';

import { createContext, ReactNode } from "react";
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
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const setLocale = (newLocale: string) => {
    const newParams = updateSearchParams(searchParams, { 'hl': newLocale });
    if (newParams !== searchParams) {
      router.replace(
        `${pathName}?${newParams.toString()}`,
        { scroll: false });
    }
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}
