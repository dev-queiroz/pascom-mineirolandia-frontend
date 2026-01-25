import axios from 'axios';
import { useAuthStore } from '../contexts/authStore';

const api = axios.create({
    baseURL: 'https://pascom-backend.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

export const endpoints = {
    login: (data: { username: string; password: string }) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    getDashboard: (month?: string) => api.get('/dashboard', { params: { month } }),
    getEvents: (month?: string) => api.get('/events', { params: { month } }),
    createContribution: (formData: FormData) =>
        api.post('/financial/contribution', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    getPendings: () => api.get('/financial/pendings'),
    confirmPendency: (id: number) => api.patch(`/financial/pendings/${id}/confirm`),
    deletePendency: (id: number) => api.delete(`/financial/pendings/${id}`),
    getPDFScale: (month: string) => api.get(`/pdf/scale?month=${month}`, { responseType: 'blob' }),
    getICS: (eventId: number) => api.get(`/extras/ics/${eventId}`, { responseType: 'blob' }),
    getWhatsAppLinks: (month: string) => api.get(`/extras/whatsapp?month=${month}`),
};