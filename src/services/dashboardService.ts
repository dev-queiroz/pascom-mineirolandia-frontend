import { apiFetch } from '@/lib/api';
import type { DashboardData } from '@/types';

export const dashboardService = {
    getStats: async (month?: string): Promise<DashboardData> => {
        const endpoint = month ? `/dashboard?month=${month}` : '/dashboard';
        return apiFetch<DashboardData>(endpoint);
    },
};