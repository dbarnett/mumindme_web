import { NextRequest, NextResponse } from "next/server";
import { getLocaleFromHeaders, getLocaleLang, supportedLocales } from '@/lib/locales';

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const localeFromParam = request.nextUrl.searchParams.get('hl');
  let supportedLocaleFromParam: string | undefined;
  if (localeFromParam) {
    supportedLocaleFromParam = supportedLocales.find((l) => l == localeFromParam);
    supportedLocaleFromParam ??= supportedLocales.find((l) => getLocaleLang(l) == getLocaleLang(localeFromParam));
  }
  const locale = supportedLocaleFromParam ??
    getLocaleFromHeaders(request.headers);
  requestHeaders.set('x-selected-locale', locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
