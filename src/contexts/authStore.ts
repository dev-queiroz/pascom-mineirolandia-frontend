import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api';

interface User {
    id: number;
    username: string;
    funcao: string;
    escalacao?: number;
    situacao: string;
    setor?: string;
    acompanhante: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => void;
    loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (credentials) => {
                const res = await api.post('/auth/login', credentials);
                const { access_token } = res.data;
                localStorage.setItem('token', access_token);
                set({ token: access_token, isAuthenticated: true });
                await useAuthStore.getState().loadUser();
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null, isAuthenticated: false });
            },

            loadUser: async () => {
                try {
                    const res = await api.get('/auth/me');
                    set({ user: res.data, isAuthenticated: true });
                } catch {
                    set({ user: null, isAuthenticated: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token }),
        }
    )
);