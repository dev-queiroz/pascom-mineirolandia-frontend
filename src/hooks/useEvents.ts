'use client';

import { useEvents, useEventDetail } from '@/queries/eventQueries';
import { useAssignSlot, useRemoveSlot } from '@/mutations/eventMutations';

export function useEventsHook(month?: string) {
    const eventsQuery = useEvents(month);
    const assignMutation = useAssignSlot();
    const removeMutation = useRemoveSlot();

    return {
        events: eventsQuery.data ?? [],
        isFirstLoading: eventsQuery.isLoading,
        isUpdating: eventsQuery.isFetching,
        error: eventsQuery.error,

        assignSlot: assignMutation.mutateAsync,
        isAssigning: assignMutation.isPending,

        removeSlot: removeMutation.mutateAsync,
        isRemoving: removeMutation.isPending,

        refetch: eventsQuery.refetch,
    };
}

export function useEvent(id: number) {
    const eventQuery = useEventDetail(id);

    return {
        event: eventQuery.data,
        isLoading: eventQuery.isLoading,
        isFetching: eventQuery.isFetching,
        error: eventQuery.error,
        refetch: eventQuery.refetch,
    };
}