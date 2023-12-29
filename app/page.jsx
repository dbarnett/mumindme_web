import { headers } from 'next/headers';
import { getSelectedLocale } from '@/lib/locales';
import { getSortedPostsData } from '@/lib/posts';
import { siteTitle, t } from '@/lib/app-messages';
import HomePage from './home-page';

export async function generateMetadata() {
  const locale = getSelectedLocale(headers());
  return {
    title: t(siteTitle, locale),
  };
}

export default async function Page() {
  const recentPosts = getSortedPostsData();
  return <HomePage recentPosts={recentPosts} />;
};
