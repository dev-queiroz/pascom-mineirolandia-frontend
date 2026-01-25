import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { endpoints } from '../api';
import type {AuthState, User} from '../types';

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (credentials) => {
                const res = await endpoints.login(credentials);
                const { access_token } = res.data;
                localStorage.setItem('token', access_token);
                set({ token: access_token, isAuthenticated: true });
                await get().loadUser();
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null, isAuthenticated: false });
            },

            loadUser: async () => {
                try {
                    const res = await endpoints.getMe();
                    set({ user: res.data as User, isAuthenticated: true });
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