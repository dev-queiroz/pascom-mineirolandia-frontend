import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { User } from '@/types';

export const authKeys = {
    all: ['auth'] as const,
    currentUser: () => [...authKeys.all, 'currentUser'] as const,
};

export function useCurrentUser() {
    return useQuery<User, Error>({
        queryKey: authKeys.currentUser(),
        queryFn: () => apiFetch<User>('/auth/me'),
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10,   // 10 minutos
        retry: 1,
        refetchOnWindowFocus: false,
    });
}