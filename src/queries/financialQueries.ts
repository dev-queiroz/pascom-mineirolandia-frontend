import { useQuery } from '@tanstack/react-query';
import type { PendingContribution } from '@/types';
import {financialService} from "@/services/financialService";

export const financialKeys = {
    all: ['financial'] as const,
    pendings: () => [...financialKeys.all, 'pendings'] as const,
};

export function usePendingContributions() {
    return useQuery<PendingContribution[], Error>({
        queryKey: financialKeys.pendings(),
        queryFn: () => financialService.listPendings(),
        staleTime: 1000 * 60,
    });
}