export interface User {
    id: number;
    username: string;
    phone?: string | null;
    escalacao?: number;
    situacao: 'ativo' | 'inativo' | string;
    setor?: string | null;
    funcao: 'user' | 'admin' | string;
    acompanhante: 'sim' | 'nao' | string;
    createdAt: string; // ISO date
}