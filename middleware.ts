import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Protected routes that require authentication
const protectedRoutes = [
  '/pricing', // After selecting a plan, redirect to sign-in
  '/api/stripe-webhook', // Webhook endpoint (uses different auth)
];

// Public routes that should redirect to home if already authenticated
const authRoutes = ['/signin'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client for server-side
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Check if route is an auth route
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect to sign-in if trying to access protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/signin', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to home if trying to access auth routes while already authenticated
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // CSRF Protection for state-changing API routes
  if (
    request.method !== 'GET' &&
    request.method !== 'HEAD' &&
    request.method !== 'OPTIONS' &&
    request.nextUrl.pathname.startsWith('/api/')
  ) {
    // Check origin header to prevent CSRF
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    if (origin && host) {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        console.warn(`CSRF attempt detected: origin=${origin}, host=${host}`);
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    // For production, also check referer as fallback
    if (!origin && process.env.NODE_ENV === 'production') {
      const referer = request.headers.get('referer');
      if (!referer || !referer.includes(host || '')) {
        console.warn(`CSRF attempt detected: missing origin, referer=${referer}`);
        return new NextResponse('Forbidden', { status: 403 });
      }
    }
  }

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
