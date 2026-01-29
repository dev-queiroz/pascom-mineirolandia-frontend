import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/services/eventService';

export const eventKeys = {
    all: ['events'] as const,
    list: (month?: string) => [...eventKeys.all, 'list', { month }] as const,
    detail: (id: number) => [...eventKeys.all, 'detail', id] as const,
};

export function useEvents(month?: string) {
    return useQuery({
        queryKey: eventKeys.list(month),
        queryFn: () => eventService.listEvents(month),
    });
}

export function useEventDetail(id: number) {
    return useQuery({
        queryKey: eventKeys.detail(id),
        queryFn: () => eventService.getEventById(id),
        enabled: !!id,
    });
}