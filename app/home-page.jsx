'use client';

import Link from 'next/link';
import Date from '../components/date';
import Layout from '../components/layout';

export default function HomePage({ recentPosts }) {
  return (
    <Layout home>
      <section className="text-xl">
        <p>I’m a software engineer and explorer.</p>
      </section>
      <section>
        <ul>
          <li className="mb-4"><Link href="/projects">My projects</Link></li>
          <li className="mb-4"><Link href="/twitter">Twitter</Link></li>
        </ul>
      </section>
      <section className="text-xl p-1">
        <h2 className="text-2xl font-bold my-4">Blog</h2>
        <ul>
          {recentPosts.map(({ id, date, title }) => (
            <li className="mb-4" key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className="text-gray-500">
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
