'use client';

import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import type { Event } from '@/types';
import { eventKeys } from '@/queries/eventQueries';

export function useEvents(month?: string) {
    return useQuery<Event[], Error>({
        queryKey: eventKeys.list(month),
        queryFn: () => eventService.listEvents(month),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 2,
        refetchOnWindowFocus: false,
        placeholderData: previousData => previousData,
    });
}