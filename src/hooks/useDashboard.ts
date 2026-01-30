'use client';

import { useDashboardStats } from '@/queries/dashboardQueries';
import { useQueryClient } from '@tanstack/react-query';
import { dashboardKeys } from '@/queries/dashboardQueries';

export function useDashboard(month?: string) {
    const queryClient = useQueryClient();
    const statsQuery = useDashboardStats(month);

    return {
        stats: statsQuery.data,
        isLoading: statsQuery.isLoading,
        error: statsQuery.error,
        isFetching: statsQuery.isFetching,
        isSuccess: statsQuery.isSuccess,
        refetch: statsQuery.refetch,
        invalidate: async () => {
            await queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    };
}