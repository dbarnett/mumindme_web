/** Wrapper component for translated messages. */
'use client';

import { Children, useContext } from 'react';
import { t } from "@/lib/app-messages";
import { I18nContext } from '@/components/i18n-provider';

export default function T({ children }) {
  const { locale } = useContext(I18nContext);
  return Children.map(children, (child) => t(child, locale));
}
