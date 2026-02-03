import { apiFetch } from '@/lib/api';
import {API_BASE_URL} from "@/lib/constants";

export const extrasService = {
    downloadIcs: async (eventId: number): Promise<void> => {
        const token = localStorage.getItem('access_token');

        const res = await fetch(`${API_BASE_URL}/extras/ics/${eventId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            if (res.status === 401) throw new Error('Sessão expirada. Faça login novamente.');
            throw new Error('Erro ao baixar calendário');
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `escala-evento-${eventId}.ics`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    },

    getWhatsAppLinks: async (month: string): Promise<string[]> => {
        return apiFetch<string[]>(`/extras/whatsapp?month=${month}`);
    }
};