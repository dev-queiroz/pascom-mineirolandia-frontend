import { apiFetch } from '@/lib/api';
import { User, LoginCredentials, AuthResponse } from '@/types';

export const authService = {
    async getMe() {
        return apiFetch<User>('/auth/me');
    },

    async login(credentials: LoginCredentials) {
        return apiFetch<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }
};