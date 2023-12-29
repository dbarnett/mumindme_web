import { NextResponse } from "next/server";
import { getLocaleFromHeaders, getLocaleLang, supportedLocales } from '@/lib/locales';

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);

  const localeFromParam = request.nextUrl.searchParams.get('hl');
  let supportedLocaleFromParam
  if (localeFromParam) { 
    supportedLocaleFromParam = supportedLocales.find((l) => l == localeFromParam);
    supportedLocaleFromParam ??= supportedLocales.find((l) => getLocaleLang(l) == getLocaleLang(localeFromParam));
  }
  const locale = supportedLocaleFromParam ??
    getLocaleFromHeaders(request.headers, supportedLocales);
  requestHeaders.set('x-selected-locale', locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
