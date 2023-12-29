import { headers } from 'next/headers';
import { getSelectedLocale } from '@/lib/locales';
import { t } from '@/lib/app-messages';
import ProjectsPage from './projects-page';

export async function generateMetadata() {
  const locale = getSelectedLocale(headers());
  return {
    title: t('My projects', locale),
  };
}

export default function Projects() {
  return <ProjectsPage />;
}
