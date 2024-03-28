'use client';

import Image from 'next/image';
import LangSelector from '@/components/lang-selector';
import Link from '@/components/link';
import T from '@/components/t';

const name = 'David B';

export default function AppLayout({ children, home, ...props }) {
  return (
    <div className="max-w-3xl px-4 mt-12 mb-24 mx-auto">
      <header className="relative flex flex-col items-center">
        <LangSelector className="absolute top-0 right-0" />
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
            <Link href="/" prefetch={true}>
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
              <Link href="/" prefetch={true} className="text-inherit">
                MuMind ({name})
              </Link>
            </h2>
          </>
        )}
      </header>
      <main {...props}>{children}</main>
      {!home && (
        <div className="mt-8">
          <Link href="/" prefetch={true}>← <T>Back to home</T></Link>
        </div>
      )}
    </div>
  );
}
