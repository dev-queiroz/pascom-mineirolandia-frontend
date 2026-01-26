import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pascom-backend.onrender.com';

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit & { public?: boolean } = {}
): Promise<T> {
    let token: string | undefined;

    // Server-side: pega do cookie
    if (typeof window === 'undefined') {
        const cookieStore = await cookies();
        token = cookieStore.get('access_token')?.value;
    }
    // Client-side: pega do cookie (document.cookie)
    else if (!options.public) {
        token = document.cookie
            .split('; ')
            .find(row => row.startsWith('access_token='))
            ?.split('=')[1];
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (res.status === 401 && !options.public) {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        throw new Error('Não autenticado');
    }

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Erro na requisição');
    }

    return res.json();
}