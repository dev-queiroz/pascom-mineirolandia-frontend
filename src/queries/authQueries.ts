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
        staleTime: 1000 * 60 * 5,
        retry: (failureCount, error: Error) => {
            if (error.message === 'UNAUTHORIZED') return false;
            return failureCount < 2;
        },
    });
}