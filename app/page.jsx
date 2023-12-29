import HomePage from './home-page';
import { siteTitle } from '@/components/layout';
import { getSortedPostsData } from '@/lib/posts';

export const metadata = {
  title: siteTitle,
};

export default async function Page() {
  const recentPosts = getSortedPostsData();
  return <HomePage recentPosts={recentPosts} />;
};
