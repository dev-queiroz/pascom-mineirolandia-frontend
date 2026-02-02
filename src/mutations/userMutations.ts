import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { userKeys } from '@/queries/userQueries';
import {CreateUserDTO, User} from "@/types";

export function useUserMutations() {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateUserDTO) => userService.createUser(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<User & { password?: string }> }) =>
            userService.updateUser(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => userService.deleteUser(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
    });

    return {
        createUser: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        updateUser: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        deleteUser: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}
