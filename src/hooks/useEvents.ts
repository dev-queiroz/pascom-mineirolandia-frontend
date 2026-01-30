'use client';

import { useEvents, useEventDetail } from '@/queries/eventQueries';
import { useAssignSlot, useRemoveSlot } from '@/mutations/eventMutations';
import { useQueryClient } from '@tanstack/react-query';
import { eventKeys } from '@/queries/eventQueries';

export function useEventsHook(month?: string) {
    const queryClient = useQueryClient();

    const eventsQuery = useEvents(month);
    const assignMutation = useAssignSlot();
    const removeMutation = useRemoveSlot();

    return {
        events: eventsQuery.data ?? [],
        isLoading: eventsQuery.isLoading,
        error: eventsQuery.error,
        isFetching: eventsQuery.isFetching,

        assignSlot: assignMutation.mutateAsync,
        isAssigning: assignMutation.isPending,
        assignError: assignMutation.error,

        removeSlot: removeMutation.mutateAsync,
        isRemoving: removeMutation.isPending,
        removeError: removeMutation.error,

        refetch: eventsQuery.refetch,

        invalidate: async () => {
            await queryClient.invalidateQueries({ queryKey: eventKeys.all });
        },
    };
}

export function useEvent(id: number) {
    const eventQuery = useEventDetail(id);

    return {
        event: eventQuery.data,
        isLoading: eventQuery.isLoading,
        error: eventQuery.error,
    };
}