import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import { eventKeys } from '@/queries/eventQueries';
import {CreateEventDTO, UpdateEventDTO} from "@/types";

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

export function useAdminEventMutations() {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateEventDTO) => eventService.createEvent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: eventKeys.all });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateEventDTO }) =>
            eventService.updateEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: eventKeys.all });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => eventService.deleteEvent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: eventKeys.all });
        },
    });

    return {
        createEvent: createMutation.mutateAsync,
        updateEvent: updateMutation.mutateAsync,
        deleteEvent: deleteMutation.mutateAsync,
        isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
    };
}
