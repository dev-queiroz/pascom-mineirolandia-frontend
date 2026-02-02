'use client';

import { useUsers } from '@/queries/userQueries';
import { useUserMutations } from '@/mutations/userMutations';

export function useUsersHook() {
    const { data: users = [], isLoading, error } = useUsers();
    const { createUser, isCreating, deleteUser, isDeleting, updateUser, isUpdating } = useUserMutations();

    return {
        users,
        isLoading,
        error,
        createUser,
        isCreating,
        deleteUser,
        isDeleting,
        updateUser,
        isUpdating,
    };
}