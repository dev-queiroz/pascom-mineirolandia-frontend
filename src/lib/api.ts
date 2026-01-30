import { API_BASE_URL } from './constants';
import {error} from "next/dist/build/output/log";

// lib/api.ts
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit & { public?: boolean } = {}
): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const headers = new Headers(options.headers || {});

    if (typeof window === 'undefined') {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;
        if (token) headers.set('Authorization', `Bearer ${token}`);
    }
    // No cliente, não injetamos o token manualmente se for httpOnly.
    // O navegador enviará o cookie automaticamente se adicionarmos 'credentials'.

    if (options.body && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            signal: controller.signal,
            headers,
            credentials: options.public ? 'omit' : 'include', // ESSENCIAL para o NestJS receber o cookie
        });

        clearTimeout(timeoutId);

        if (res.status === 401 && !options.public) {
            throw new Error('UNAUTHORIZED');
        }

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${res.status}`);
        }

        return await res.json();
    } catch {
        clearTimeout(timeoutId);
        throw new Error(`Unable to retrieve ${endpoint}`);
    }
}