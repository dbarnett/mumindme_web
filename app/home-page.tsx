'use client';

import { useState } from 'react';
import AppLayout from '@/components/app-layout';
import Date from '@/components/date';
import Link from '@/components/link';
import T from '@/components/t';
import { PostMetadata } from '@/lib/posts';

interface HomePageProps {
  recentPosts: PostMetadata[];
}

export default function HomePage({ recentPosts }: HomePageProps) {
  const [showAllPosts, setShowAllPosts] = useState(false);
  const INITIAL_POST_COUNT = 3;

  const postsToShow = showAllPosts ? recentPosts : recentPosts.slice(0, INITIAL_POST_COUNT);
  const hasMorePosts = recentPosts.length > INITIAL_POST_COUNT;

  return (
    <AppLayout home>
      <section className="text-xl">
        <p><T>I’m a software engineer and explorer.</T></p>
      </section>
      <section>
        <ul>
          <li className="mb-4"><Link href="/projects" prefetch={true}><T>My projects</T></Link></li>
          <li className="mb-4"><a href="/twitter">Twitter</a></li>
        </ul>
      </section>
      <section className="text-xl p-1">
        <h2 className="text-2xl font-bold my-4"><T>Recent posts</T></h2>
        <ul>
          {postsToShow.map(({ id, date, title }) => (
            <li className="mb-4" key={id}>
              <Link href={`/posts/${id}`} prefetch={true}><T>{title}</T></Link>
              <br />
              <small className="text-gray-500">
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
        {hasMorePosts && (
          <div className="mt-4">
            <button
              onClick={() => setShowAllPosts(!showAllPosts)}
              className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              {showAllPosts ? (
                <T>Show fewer posts</T>
              ) : (
                <T>Show all posts ({recentPosts.length})</T>
              )}
            </button>
          </div>
        )}
      </section>
    </AppLayout>
  );
}
