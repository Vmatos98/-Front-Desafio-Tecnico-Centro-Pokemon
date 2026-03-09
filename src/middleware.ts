import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get('sim_int_token')?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');

  // If the user doesn't have a token and is NOT on an auth page, redirect to /login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user has a token and is ON an auth page, redirect to /pokedex
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/pokedex', request.url));
  }

  // If user accesses the root path (`/`) with a token, go to pokedex
  if (token && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/pokedex', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
