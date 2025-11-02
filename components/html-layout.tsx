'use client';

import { ReactNode, useContext } from 'react';
import { I18nContext } from '@/components/i18n-provider';

interface HtmlLayoutProps {
  children: ReactNode;
}

export default function HtmlLayout({ children }: HtmlLayoutProps) {
  const { locale } = useContext(I18nContext);
  return (
    <html lang={locale ?? undefined}>
      <body>{children}</body>
    </html>
  );
}
