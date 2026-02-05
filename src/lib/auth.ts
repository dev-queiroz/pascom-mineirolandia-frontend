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
        credentials: 'include'
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Credenciais inválidas');
    }

    const data = await res.json();

    if (data.access_token) {
        const cookieStore = await cookies();
        cookieStore.set('access_token', data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
    }

    return data;
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    return { success: true };
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