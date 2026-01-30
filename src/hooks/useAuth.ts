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
            return await loginAction(formData);
        },
        onSuccess: async () => {
            await queryClient.resetQueries({ queryKey: authKeys.all });

            router.push('/dashboard');
            router.refresh();
        },
    });

    const logoutMutation = useMutation({
        mutationFn: logoutAction,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: authKeys.all });
            router.push('/login');
            router.refresh();
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