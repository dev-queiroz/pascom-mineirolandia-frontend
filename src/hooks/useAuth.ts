'use client';

import { useCurrentUser } from '@/queries/authQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginAction, logoutAction } from '@/lib/auth';
import { authKeys } from '@/queries/authQueries';
import {redirect, usePathname, useRouter} from 'next/navigation';
import {AuthResponse} from "@/types";

export function useAuth() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const path = usePathname();

    const { data: user, isLoading, error } = useCurrentUser();

    if (!isLoading && !user) {
        if (path.startsWith('/events') || path.startsWith('/dashboard') || path.startsWith('/financial')) {
            redirect('/login');
        }
    }

    const loginMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return await loginAction(formData);
        },
        onSuccess: (data: AuthResponse) => {
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
            }
            queryClient.invalidateQueries({ queryKey: authKeys.all });
            router.push('/dashboard');
        },
    });

    const logoutMutation = useMutation({
        mutationFn: logoutAction,
        onSuccess: () => {
            localStorage.removeItem('access_token');
            queryClient.removeQueries({ queryKey: authKeys.all });
            router.push('/login?success=Logout realizado com sucesso');
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