import { useQuery } from '@tanstack/react-query';
import type {FinancialSummary, PendingContribution} from '@/types';
import {financialService} from "@/services/financialService";

export const financialKeys = {
    all: ['financial'] as const,
    pendings: () => [...financialKeys.all, 'pendings'] as const,
    summary: (month?: string) => ['financial', 'summary', month].filter(Boolean),
};

export function usePendingContributions() {
    return useQuery<PendingContribution[], Error>({
        queryKey: financialKeys.pendings(),
        queryFn: () => financialService.listPendings(),
        staleTime: 1000 * 60,
    });
}

export function useFinancialSummary(month?: string) {
    return useQuery<FinancialSummary, Error>({
        queryKey: financialKeys.summary(month),
        queryFn: () => financialService.getSummary(month),
        placeholderData: (previousData) => previousData,
    });
}