import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Si les variables Supabase ne sont pas configurées, laisser passer toutes les requêtes
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value; },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;

  // Protéger /platform — redirection vers /login si non connecté
  if (!session && pathname.startsWith('/platform')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protéger /dashboard — réservé à relia.ebiya@gmail.com
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.user?.email !== 'relia.ebiya@gmail.com') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protéger /onboarding — auth requise
  if (pathname === '/onboarding' && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Rediriger vers /platform si déjà connecté et sur /login ou /signup
  if (session && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/platform', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/platform/:path*', '/dashboard/:path*', '/onboarding', '/login', '/signup'],
};
