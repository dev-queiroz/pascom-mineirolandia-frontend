import {User} from "@/types/user";

export interface DashboardData {
    pendencias: {
        count: number;
        total: number;
    };
    escalasMes: number;
    usuarios: {
        ativos: number;
        inativos: number;
    };
    ultimasJustificativas: {
        id: number;
        justification: string;
        timestamp: string;
        user: Pick<User, 'username'>;
    }[];
    saldo: {
        total: number;
        entradas: number;
        saidas: number;
    };
}