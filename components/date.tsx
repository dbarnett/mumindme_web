'use client';

import { useContext } from "react";
import { parseISO } from "date-fns";
import { I18nContext } from '@/components/i18n-provider';

interface DateProps {
  dateString: string;
}

export default function Date({ dateString }: DateProps) {
  const { locale } = useContext(I18nContext);
  const date = parseISO(dateString);
  const formatter = new Intl.DateTimeFormat(locale ?? undefined, { dateStyle: 'medium' });
  return <time dateTime={dateString}>{formatter.format(date)}</time>;
}
