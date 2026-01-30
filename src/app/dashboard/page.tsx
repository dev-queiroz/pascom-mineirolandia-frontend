import { requireAuth } from '@/lib/auth';
import { dashboardService } from '@/services/dashboardService';
import { StatCard } from '@/components/common/StatCard';
import { DollarSign, Calendar, Users, AlertCircle } from 'lucide-react';

export default async function DashboardPage() {
    const user = await requireAuth();
    const stats = await dashboardService.getStats();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header de Boas-vindas */}
            <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    Bem-vindo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{user.username}</span>!
                </h1>
                <p className="text-gray-400 mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs uppercase tracking-wider text-purple-400 font-bold">
                        {user.funcao === 'admin' ? 'Administrador' : 'Membro'}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-sm italic">Limite mensal: {user.escalacao || 2} escalas</span>
                </p>
            </div>

            {/* Grid de Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="Pendências Financeiras"
                    value={stats.pendencias.count}
                    icon={<AlertCircle className="w-8 h-8 md:w-10 md:h-10" />}
                    color="red"
                />
                <StatCard
                    title="Escalas do Mês"
                    value={stats.escalasMes}
                    icon={<Calendar className="w-8 h-8 md:w-10 md:h-10" />}
                    color="blue"
                />
                <StatCard
                    title="Saldo Atual"
                    value={`R$ ${stats.saldo.total.toFixed(2)}`}
                    icon={<DollarSign className="w-8 h-8 md:w-10 md:h-10" />}
                    color={stats.saldo.total >= 0 ? 'green' : 'red'}
                />
                <StatCard
                    title="Usuários Ativos"
                    value={stats.usuarios.ativos}
                    icon={<Users className="w-8 h-8 md:w-10 md:h-10" />}
                    color="purple"
                />
            </div>

            {/* Card de Justificativas com Glassmorphism */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                    <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                    Últimas Justificativas
                </h2>

                {stats.ultimasJustificativas.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-gray-500">Nenhuma justificativa recente.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="text-gray-500 text-sm border-b border-white/5">
                                <th className="pb-4 font-medium">Usuário</th>
                                <th className="pb-4 font-medium">Motivo</th>
                                <th className="pb-4 font-medium text-right">Data</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                            {stats.ultimasJustificativas.map(j => (
                                <tr key={j.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 font-semibold text-gray-200">{j.user.username}</td>
                                    <td className="py-4 text-gray-400 text-sm md:text-base">{j.justification}</td>
                                    <td className="py-4 text-right text-[10px] md:text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(j.timestamp).toLocaleString('pt-BR')}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}