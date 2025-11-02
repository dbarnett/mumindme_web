/** Wrapper component for translated messages. */
'use client';

import { Children, ReactNode, useContext } from 'react';
import { t } from "@/lib/app-messages";
import { I18nContext } from '@/components/i18n-provider';

interface TProps {
  children: ReactNode;
}

export default function T({ children }: TProps) {
  const { locale } = useContext(I18nContext);
  return Children.map(children, (child) => t(child as string, locale));
}
