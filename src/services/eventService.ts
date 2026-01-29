import { apiFetch } from '@/lib/api';
import { Event } from '@/types';
import { API_BASE_URL } from '@/lib/constants';

export const eventService = {
    async listEvents(month?: string) {
        const query = month ? `?month=${month}` : '';
        return apiFetch<Event[]>(`/events${query}`);
    },

    async getEventById(id: number) {
        return apiFetch<Event>(`/events/${id}`);
    },

    async downloadScalePdf(month: string) {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('access_token='))
            ?.split('=')[1];

        const res = await fetch(`${API_BASE_URL}/pdf/scale?month=${month}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error('Erro ao gerar PDF');

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `escala-pascom-${month}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
};