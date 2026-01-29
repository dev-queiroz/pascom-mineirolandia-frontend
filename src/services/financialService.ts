import { apiFetch } from '@/lib/api';
import { Contribution, PendingContribution } from '@/types';

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