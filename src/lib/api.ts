import { API_BASE_URL } from './constants';

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

    if (options.body && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: options.public ? 'omit' : 'include',
        });

        if (res.status === 401 && !options.public) {
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${res.status}`);
        }

        return await res.json();
    } catch (error: unknown) {
        clearTimeout(timeoutId);

        if (error instanceof Error) {
            if (error.message !== 'Failed to fetch' && error.name !== 'AbortError') {
                throw error;
            }
        }

        throw new Error(`Erro de conexão ao acessar ${endpoint}`);
    }
}