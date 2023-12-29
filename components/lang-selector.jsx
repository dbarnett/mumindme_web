'use client';

import { useContext } from 'react';
import { I18nContext } from '@/components/i18n-provider';

export default function LangSelector({
  ...props
}) {
  const { setLocale } = useContext(I18nContext);
  return (
    <div {...props}>
      <button className="block" onClick={() => setLocale('en-US')}>English 🇺🇸</button>
      <button className="block" onClick={() => setLocale('es-MX')}>Spanish 🇲🇽</button>
    </div>
  );
}
