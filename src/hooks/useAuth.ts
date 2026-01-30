'use client';

import { useCurrentUser } from '@/queries/authQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginAction, logoutAction } from '@/lib/auth';
import { authKeys } from '@/queries/authQueries';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: user, isLoading, error } = useCurrentUser();

    const loginMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            await loginAction(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
        },
        onError: (err) => {
            console.error('Erro no login:', err);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await logoutAction();
        },
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: authKeys.all });
            router.refresh();
        },
        onError: (err) => {
            console.error('Erro no logout:', err);
        },
    });

    return {
        user,
        isAuthenticated: !!user,
        isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
        error: error || loginMutation.error || logoutMutation.error,
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
    };
}