import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';

function getLocaleFromCountry(request: NextRequest): string {
  // Vercel automatically sets this header based on the visitor's IP
  const country = request.headers.get('x-vercel-ip-country');

  // Serbian for visitors from Serbia, English for everyone else
  if (country === 'RS') {
    return 'sr';
  }

  // Fallback to default locale locally (header won't exist in dev)
  if (!country) {
    return i18n.defaultLocale;
  }

  return 'en';
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocaleFromCountry(request);

    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc.)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next/data).*)',
  ],
};
