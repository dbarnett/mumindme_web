'use client';

import { useContext } from "react";
import { parseISO } from "date-fns";
import { I18nContext } from '@/components/i18n-provider';

export default function Date({ dateString }) {
  const { locale } = useContext(I18nContext);
  const date = parseISO(dateString);
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  return <time dateTime={dateString}>{formatter.format(date)}</time>;
}
