import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';

export const dashboardKeys = {
    all: ['dashboard'] as const,
    stats: (month?: string) => [...dashboardKeys.all, 'stats', { month }] as const,
};

export function useDashboardStats(month?: string) {
    return useQuery({
        queryKey: dashboardKeys.stats(month),
        queryFn: () => dashboardService.getStats(month),
        staleTime: 1000 * 60 * 5,
    });
}