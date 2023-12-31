import { headers } from 'next/headers';
import { t } from '@/lib/app-messages';
import HtmlLayout from '@/components/html-layout';
import I18nProvider from '@/components/i18n-provider';
import '@/styles/global.css';

export function generateMetadata() {
  const locale = headers().get('x-selected-locale');
  return {
    metadataBase: new URL('https://mumind.me'),
    description: t('Personal website with musings and portfolio stuff', locale),
    openGraph: {
      type: 'website',
    },
  };
}

export default function RootLayout({
  children,
}) {
  // TODO: #7 - Only use selected locale if supported by page?
  const locale = headers().get('x-selected-locale');
  return (
    <I18nProvider locale={locale}>
      <HtmlLayout>
        {children}
      </HtmlLayout>
    </I18nProvider>
  );
}
