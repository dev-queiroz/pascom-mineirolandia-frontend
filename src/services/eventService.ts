import { apiFetch } from '@/lib/api';
import type {CreateEventDTO, Event, UpdateEventDTO} from '@/types';
import { API_BASE_URL } from "@/lib/constants";

export const eventService = {
    listEvents: async (month?: string): Promise<Event[]> => {
        const query = month ? `?month=${month}` : '';
        return apiFetch<Event[]>(`/events${query}`);
    },

    getEventById: async (id: number): Promise<Event> => {
        return apiFetch<Event>(`/events/${id}`);
    },

    downloadScalePdf: async (month: string): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/pdf/scale?month=${month}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (res.status === 401) throw new Error('Não autorizado: Acesso apenas para Admins');
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

    createEvent: async (data: CreateEventDTO): Promise<Event> => {
        return apiFetch<Event>('/events', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateEvent: async (id: number, data: UpdateEventDTO): Promise<Event> => {
        return apiFetch<Event>(`/events/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    deleteEvent: async (id: number): Promise<void> => {
        return apiFetch(`/events/${id}`, {
            method: 'DELETE',
        });
    },
};