'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_BASE_URL } from './constants';
import type { User } from '@/types';

export async function loginAction(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        // credentials: 'include' não é mais necessário aqui
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Credenciais inválidas');
    }

    const { access_token } = await res.json();

    // Crie o cookie httpOnly no domínio do frontend (Vercel)
    (await cookies()).set('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true em prod
        sameSite: 'lax', // ou 'strict' – 'none' só se precisar cross-site real
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return { success: true, message: 'Login realizado com sucesso' };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    redirect('/login?success=Logout realizado com sucesso');
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) return null;

    const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });

    if (!res.ok) {
        cookieStore.delete('access_token');
        return null;
    }

    return res.json();
}

export async function requireAuth(): Promise<User> {
    const user = await getCurrentUser();
    if (!user) redirect('/login');
    return user;
}