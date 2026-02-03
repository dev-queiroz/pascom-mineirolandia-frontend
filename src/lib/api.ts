import { API_BASE_URL } from './constants';

// lib/api.ts
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit & { public?: boolean } = {}
): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const headers = new Headers(options.headers || {});

    let token: string | undefined;

    try {
        if (typeof window === 'undefined') {
            // Server-side: Server Components, Server Actions, getServerSideProps, etc.
            const { cookies } = await import('next/headers');
            token = (await cookies()).get('access_token')?.value;
            headers.set('Authorization', `Bearer ${token}`);
        }
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        } else {
        token = localStorage.getItem('access_token') ?? undefined;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
    }
    } catch (err) {
        console.error('Erro ao ler cookie no apiFetch:', err);
    }

    if (options.body && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'omit', // correto para Bearer
        });

        if (res.status === 401 && !options.public) {
            // Opcional: limpar cookie se 401
            if (typeof window === 'undefined') {
                const { cookies } = await import('next/headers');
                (await cookies()).delete('access_token');
            }
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