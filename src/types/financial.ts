export interface Contribution {
    id: number;
    type: 'entrada' | 'saida';
    value: number | string; // Decimal no backend
    date: string; // ISO date
    time?: string | null; // 'HH:mm'
    note?: string;
    receipt?: string | null; // caminho do arquivo
    userId: number;
    status: 'pendente' | 'confirmado';
    createdAt: string;
    user?: { username: string };
}

export interface PendingContribution extends Contribution {
    user: { username: string };
}