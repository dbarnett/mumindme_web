'use client';

import AppLayout from '@/components/app-layout';
import Date from '@/components/date';
import Link from '@/components/link';
import T from '@/components/t';

export default function HomePage({ recentPosts }) {
  return (
    <AppLayout home>
      <section className="text-xl">
        <p><T>I’m a software engineer and explorer.</T></p>
      </section>
      <section>
        <ul>
          <li className="mb-4"><Link href="/projects"><T>My projects</T></Link></li>
          <li className="mb-4"><a href="/twitter">Twitter</a></li>
        </ul>
      </section>
      <section className="text-xl p-1">
        <h2 className="text-2xl font-bold my-4"><T>Recent posts</T></h2>
        <ul>
          {recentPosts.map(({ id, date, title }) => (
            <li className="mb-4" key={id}>
              <Link href={`/posts/${id}`}><T>{title}</T></Link>
              <br />
              <small className="text-gray-500">
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </AppLayout>
  );
}
