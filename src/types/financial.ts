import {User} from "@/types/user";

export interface Contribution {
    id: number;
    type: 'entrada' | 'saida';
    value: number | string; // Decimal
    date: string; // ISO date
    time?: string | null; // 'HH:mm'
    note?: string | null;
    receipt?: string | null; // caminho do arquivo
    userId: number;
    status: 'pendente' | 'confirmado';
    createdAt: string;
    user?: Pick<User, 'username'> | null;
}

export interface PendingContribution extends Contribution {
    user: Pick<User, 'username'>;
}

export interface FinancialSummary {
    entradas: number;
    saidas: number;
    saldo: number;
}