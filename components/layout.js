import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const name = 'David B';
export const siteTitle = `MuMind (${name}) personal website`;

export default function Layout({ children, home }) {
  return (
    <div className="max-w-3xl px-4 mt-12 mb-24 mx-auto">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:type" content="website" />
        <meta name="og:title" content={siteTitle} />
        <meta
          name="description"
          content="Personal website with musings and portfolio stuff"
        />
        <meta name="og:image" content="/images/profile_wide.jpg" />
      </Head>
      <header className="flex flex-col items-center">
        {home ? (
          <>
            <Image
              priority
              src="/images/profile.jpg"
              className="rounded-full"
              height={144}
              width={144}
              alt={name}
            />
            <h1 className="text-4xl font-extrabold my-4">MuMind ({name})</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <Image
                priority
                src="/images/profile.jpg"
                className="rounded-full"
                height={108}
                width={108}
                alt={name}
              />
            </Link>
            <h2 className="text-2xl font-bold my-4">
              <Link href="/" className="text-inherit">
                MuMind ({name})
              </Link>
            </h2>
          </>
        )}
      </header>
      <main>{children}</main>
      {!home && (
        <div className="mt-8">
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  );
}
