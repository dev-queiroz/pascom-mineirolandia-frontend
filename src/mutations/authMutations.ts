import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginAction, logoutAction } from '@/lib/auth';
import { authKeys } from '@/queries/authQueries';

export function useLoginMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            await loginAction(formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
        },
    });
}

export function useLogoutMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logoutAction,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: authKeys.all });
        },
    });
}