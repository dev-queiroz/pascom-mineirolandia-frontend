'use server';

import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {API_BASE_URL} from './constants';
import type {User} from '@/types';
import {apiFetch} from "@/lib/api";

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

    if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access_token);
    }

    return { success: true, message: 'Login realizado com sucesso' };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    localStorage.removeItem('access_token');
    redirect('/login?success=Logout realizado com sucesso');
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) return null;

    try {
        return await apiFetch<User>('/auth/me', {public: false});
    } catch (err) {
        console.error('Erro em getCurrentUser:', err);
        cookieStore.delete('access_token');
        return null;
    }
}

export async function requireAuth(): Promise<User> {
    const user = await getCurrentUser();
    if (!user) redirect('/login');
    return user;
}