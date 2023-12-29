/**
 * Wrapper for Link that persists certain state/params.
 *
 * See also: https://reacthustle.com/blog/how-to-persist-nextjs-query-params-using-link-component.
 */
'use client';

import NextLink from 'next/link';
import { useSearchParams } from "next/navigation";

export default function Link({
  href,
  ...props
}) {
  const searchParams = useSearchParams();
  const hlParam = searchParams.get('hl');
  const stickyParams = {};
  if (hlParam != null) {
    stickyParams.hl = hlParam;
  }

  const hrefObj = typeof href === 'object'
    ? href
    : hrefStringToObj(href);
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

function hrefStringToObj(hrefString) {
  const href = new URL(hrefString, 'http://.');
  return {
    pathname: href.pathname,
    query: Object.fromEntries(href.searchParams.entries()),
  };
}
