import { apiFetch } from '@/lib/api';
import type { Event } from '@/types';

export const eventService = {
    listEvents: async (month?: string): Promise<Event[]> => {
        const query = month ? `?month=${month}` : '';
        return apiFetch<Event[]>(`/events${query}`);
    },

    getEventById: async (id: number): Promise<Event> => {
        return apiFetch<Event>(`/events/${id}`);
    },

    downloadScalePdf: async (month: string): Promise<void> => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('access_token='))
            ?.split('=')[1];

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pdf/scale?month=${month}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error('Erro ao gerar PDF da escala');

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `escala-pascom-${month}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    },

    assignSlot: async (eventId: number, slotOrder: number): Promise<void> => {
        return apiFetch(`/events/${eventId}/assign`, {
            method: 'POST',
            body: JSON.stringify({ slotOrder }),
        });
    },

    removeSlot: async (eventId: number, slotOrder: number, justification: string): Promise<void> => {
        return apiFetch(`/events/${eventId}/remove`, {
            method: 'POST',
            body: JSON.stringify({ slotOrder, justification }),
        });
    },
};