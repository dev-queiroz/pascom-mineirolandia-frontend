import { apiFetch } from '@/lib/api';
import {API_BASE_URL} from "@/lib/constants";

export const extrasService = {
    downloadIcs: async (eventId: number): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/extras/ics/${eventId}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!res.ok) throw new Error('Erro ao baixar calendário');

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `evento-pascom.ics`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    },

    getWhatsAppLinks: async (month: string): Promise<string[]> => {
        return apiFetch<string[]>(`/extras/whatsapp?month=${month}`);
    }
};