import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

const protectedRoutes = ['/dashboard', '/events', '/financial', '/admin'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('access_token')?.value;

    if (process.env.NODE_ENV === 'development') {
        console.log(`Middleware: ${pathname} - Token: ${token ? 'present' : 'missing'}`);
    }

    if (pathname === '/login' || pathname === '/' || pathname.startsWith('/_next')) {
        if (token && pathname === '/login') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (token) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store',
                method: 'GET',
            });

            if (!res.ok) {
                throw new Error('Token inválido');
            }

            return NextResponse.next();
        } catch {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('access_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/events/:path*',
        '/financial/:path*',
        '/admin/:path*',
        '/login'
    ],
};