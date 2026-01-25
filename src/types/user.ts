export interface User {
    id: number;
    username: string;
    phone?: string;
    escalacao?: number;
    situacao: string; // 'ativo' | 'inativo' etc.
    setor?: string;
    funcao: string; // 'user' | 'admin'
    acompanhante: string; // 'sim' | 'nao'
    createdAt: string; // ISO date
}