/**
 * Wrapper for Link that persists certain state/params.
 *
 * See also: https://reacthustle.com/blog/how-to-persist-nextjs-query-params-using-link-component.
 */
'use client';

import { ComponentProps } from 'react';
import NextLink from 'next/link';
import { useSearchParams } from "next/navigation";

type NextLinkProps = ComponentProps<typeof NextLink>;

interface HrefObject {
  pathname: string;
  query?: Record<string, string>;
}

export default function Link({
  href,
  ...props
}: NextLinkProps) {
  const searchParams = useSearchParams();
  const hlParam = searchParams.get('hl');
  const stickyParams: Record<string, string> = {};
  if (hlParam != null) {
    stickyParams.hl = hlParam;
  }

  const hrefObj: HrefObject = typeof href === 'object'
    ? href as HrefObject
    : hrefStringToObj(href as string);
  hrefObj.query = {
    ...stickyParams,
    ...hrefObj.query
  };

  return (
    <NextLink
      {...props}
      href={hrefObj}
    />
  );
}

function hrefStringToObj(hrefString: string): HrefObject {
  const href = new URL(hrefString, 'http://.');
  return {
    pathname: href.pathname,
    query: Object.fromEntries(href.searchParams.entries()),
  };
}
