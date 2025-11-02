'use client';

import { HTMLAttributes, useContext } from 'react';
import { I18nContext } from '@/components/i18n-provider';

type LangSelectorProps = HTMLAttributes<HTMLDivElement>;

export default function LangSelector(props: LangSelectorProps) {
  const { setLocale } = useContext(I18nContext);
  return (
    <div {...props}>
      <button className="block" onClick={() => setLocale('en-US')}>English 🇺🇸</button>
      <button className="block" onClick={() => setLocale('es-MX')}>Spanish 🇲🇽</button>
    </div>
  );
}
