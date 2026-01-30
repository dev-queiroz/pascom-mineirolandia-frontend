'use client';

import { usePendingContributions } from '@/queries/financialQueries';
import { useCreateContribution, useConfirmContribution, useDeleteContribution } from '@/mutations/financialMutations';
import { useQueryClient } from '@tanstack/react-query';
import { dashboardKeys } from '@/queries/dashboardQueries';

export function useFinancial() {
    const queryClient = useQueryClient();
    const pendingsQuery = usePendingContributions();
    const createMutation = useCreateContribution();
    const confirmMutation = useConfirmContribution();
    const deleteMutation = useDeleteContribution();

    return {
        pendings: pendingsQuery.data ?? [],
        isLoadingPendings: pendingsQuery.isLoading,
        pendingsError: pendingsQuery.error,
        createContribution: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        createError: createMutation.error,
        confirmContribution: confirmMutation.mutateAsync,
        isConfirming: confirmMutation.isPending,
        confirmError: confirmMutation.error,
        deleteContribution: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        deleteError: deleteMutation.error,
        refetchAll: async () => {
            await Promise.all([
                pendingsQuery.refetch(),
                queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
            ]);
        },
    };
}