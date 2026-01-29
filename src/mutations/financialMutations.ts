import { useMutation, useQueryClient } from '@tanstack/react-query';
import { financialService } from '@/services/financialService';
import { financialKeys } from '@/queries/financialQueries';
import { dashboardKeys } from '@/queries/dashboardQueries';

export function useCreateContribution() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => financialService.createContribution(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: financialKeys.all });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}

export function useConfirmContribution() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => financialService.confirmContribution(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: financialKeys.pendings() });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}

export function useDeleteContribution() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => financialService.deleteContribution(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: financialKeys.all });
        },
    });
}