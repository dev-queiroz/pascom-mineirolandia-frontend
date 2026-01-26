// src/middleware/auth.ts (ajuste final)
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
    '/dashboard',
    '/events',
    '/financial',
    '/admin', // tudo que começa com /admin
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Libera rotas públicas
    if (pathname === '/login' || pathname === '/') {
        return NextResponse.next();
    }

    // Verifica token
    const token = request.cookies.get('access_token')?.value;

    // Se rota protegida e sem token → redirect
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // (Opcional) Validação real do token
    if (token) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store',
            });

            if (!res.ok) {
                const response = NextResponse.redirect(new URL('/login', request.url));
                response.cookies.delete('access_token');
                return response;
            }

            // Token válido → continua + adiciona header para páginas
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-user-role', (await res.json()).funcao || 'user');

            return NextResponse.next({ request: { headers: requestHeaders } });
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
    ],
};