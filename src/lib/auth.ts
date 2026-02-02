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
        credentials: 'include',           // ← OBRIGATÓRIO para receber/enviar cookie cross-origin
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Credenciais inválidas');
    }

    // NÃO precisa mais setar cookie manualmente aqui
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