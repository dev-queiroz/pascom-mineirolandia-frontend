import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventKeys } from '@/queries/eventQueries';

export function useInvalidateEvents() {
    const queryClient = useQueryClient();

    return () => {
        void queryClient.invalidateQueries({ queryKey: eventKeys.all });
    };
}

export function useUpdateSlotPlaceholder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Record<string, unknown> }) => {
            console.log('Atualizando slot:', id, data);
            return Promise.resolve();
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: eventKeys.all });
        },
    });
}