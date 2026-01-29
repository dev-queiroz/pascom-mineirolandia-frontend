import { API_BASE_URL } from './constants';
import {error} from "next/dist/build/output/log";

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit & { public?: boolean } = {}
): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos

    let token: string | undefined;

    if (typeof window === 'undefined') {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        token = cookieStore.get('access_token')?.value;
    }
    else if (!options.public) {
        token = document.cookie
            .split('; ')
            .find(row => row.startsWith('access_token='))
            ?.split('=')[1];
    }

    const headers = new Headers(options.headers || {});
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    if (options.body && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            signal: controller.signal,
            headers,
        });

        clearTimeout(timeoutId);

        if (res.status === 401 && !options.public) {
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || `Erro ${res.status} na requisição`);
        }

        return await res.json() as Promise<T>;

    } catch {
        if (error.name === 'AbortError') {
            throw new Error('Tempo de requisição esgotado. Tente novamente.');
        }
        throw error;
    }
}