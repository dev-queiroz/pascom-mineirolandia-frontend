import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';

export const userKeys = {
    all: ['users'] as const,
};

export function useUsers() {
    return useQuery({
        queryKey: userKeys.all,
        queryFn: userService.listUsers,
    });
}