import { apiFetch } from '@/lib/api';
import { DashboardData } from '@/types';

export const dashboardService = {
    async getStats(month?: string) {
        const endpoint = month ? `/dashboard?month=${month}` : '/dashboard';
        return apiFetch<DashboardData>(endpoint);
    }
};