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

export interface CreateUserDTO {
    username: string;
    password?: string;
    phone?: string | null;
    setor?: string | null;
    funcao?: 'user' | 'admin' | string;
}

export interface UserUpdateDTO extends CreateUserDTO {
    situacao?: 'ativo' | 'inativo' | string;
}
