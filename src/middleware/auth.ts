// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const { pathname } = request.nextUrl;

    // Se estiver no login e já tiver token, vai direto pro dashboard
    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Se tentar acessar rotas protegidas sem token, vai pro login
    const isProtectedRoute = ['/dashboard', '/events', '/financial', '/admin'].some(
        route => pathname.startsWith(route)
    );

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Protege tudo exceto arquivos estáticos e rotas de API internas
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};