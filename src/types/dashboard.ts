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
        user: { username: string };
    }[];
    saldo: {
        total: number;
        entradas: number;
        saidas: number;
    };
}