'use client';

import { useContext } from 'react';
import { I18nContext } from '@/components/i18n-provider';

export default function HtmlLayout({
  children,
}) {
  const { locale } = useContext(I18nContext);
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
