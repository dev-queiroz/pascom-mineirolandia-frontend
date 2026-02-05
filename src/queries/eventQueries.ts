import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';
import type { Event } from '@/types';

export const eventKeys = {
    all: ['events'] as const,
    list: (month?: string) => [...eventKeys.all, 'list', month] as const,
    detail: (id: number) => [...eventKeys.all, 'detail', id] as const,
};

export function useEvents(month?: string) {
    return useQuery<Event[], Error>({
        queryKey: eventKeys.list(month),
        queryFn: () => eventService.listEvents(month),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 2,
        refetchOnWindowFocus: false,
    });
}

export function useEventDetail(id: number) {
    return useQuery<Event, Error>({
        queryKey: eventKeys.detail(id),
        queryFn: () => eventService.getEventById(id),
        enabled: !!id,
    });
}