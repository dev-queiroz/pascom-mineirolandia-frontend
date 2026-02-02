import { apiFetch } from '@/lib/api';
import { User, CreateUserDTO } from '@/types/user';

export const userService = {
    listUsers: async (): Promise<User[]> => {
        return apiFetch<User[]>('/users');
    },

    getUserById: async (id: number): Promise<User> => {
        return apiFetch<User>(`/users/${id}`);
    },

    async createUser(data: CreateUserDTO): Promise<User> {
        return apiFetch<User>('/users', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateUser: async (id: number, data: Partial<User & { password?: string }>): Promise<User> => {
        return apiFetch<User>(`/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    deleteUser: async (id: number): Promise<void> => {
        return apiFetch(`/users/${id}`, {
            method: 'DELETE',
        });
    }
};