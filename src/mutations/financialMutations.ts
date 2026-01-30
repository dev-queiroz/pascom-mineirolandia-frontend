import { useMutation, useQueryClient } from '@tanstack/react-query';
import { financialService } from '@/services/financialService';
import { financialKeys } from '@/queries/financialQueries';
import { dashboardKeys } from '@/queries/dashboardQueries';

export function useCreateContribution() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: financialService.createContribution,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: financialKeys.all });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}

export function useConfirmContribution() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: financialService.confirmContribution,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: financialKeys.pendings() });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}

export function useDeleteContribution() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: financialService.deleteContribution,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: financialKeys.all });
        },
    });
}