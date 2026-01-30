import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { eventKeys } from '@/queries/eventQueries';

export function useAssignSlot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ eventId, slotOrder }: { eventId: number; slotOrder: number }) =>
            eventService.assignSlot(eventId, slotOrder),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: eventKeys.all });
        },
        onError: (error) => {
            console.error('Erro ao servir vaga:', error);
        },
    });
}

export function useRemoveSlot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ eventId, slotOrder, justification }: { eventId: number; slotOrder: number; justification: string }) =>
            eventService.removeSlot(eventId, slotOrder, justification),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: eventKeys.all });
        },
        onError: (error) => {
            console.error('Erro ao desistir da vaga:', error);
        },
    });
}