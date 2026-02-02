import { apiFetch } from '@/lib/api';
import {Contribution, FinancialSummary, PendingContribution} from '@/types';

export const financialService = {
    async createContribution(data: FormData) {
        return apiFetch<Contribution>('/financial/contribution', {
            method: 'POST',
            body: data,
        });
    },

    async listPendings() {
        return apiFetch<PendingContribution[]>('/financial/pendings');
    },

    async getSummary(month?: string) {
        const query = month ? `?month=${month}` : '';
        return apiFetch<FinancialSummary>(`/financial/summary${query}`);
    },

    async confirmContribution(id: number) {
        return apiFetch(`/financial/pendings/${id}/confirm`, {
            method: 'PATCH',
        });
    },

    async deleteContribution(id: number) {
        return apiFetch(`/financial/pendings/${id}`, {
            method: 'DELETE',
        });
    }
};