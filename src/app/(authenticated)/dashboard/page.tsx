import { requireAuth } from '@/lib/auth';
import { dashboardService } from '@/services/dashboardService';
import { StatCard } from '@/components/common/StatCard';
import { DollarSign, Calendar, Users, AlertCircle } from 'lucide-react';
import ExportPdfButton from '@/components/common/ExportPdfButton';

export default async function DashboardPage() {
    const user = await requireAuth();
    const stats = await dashboardService.getStats();
    const currentMonth = new Date().getMonth() + 1;
    const monthStr = currentMonth.toString().padStart(2, '0');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header de Boas-vindas */}
            <div className="flex flex-col lg:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                        Bem-vindo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{user.username}</span>!
                    </h1>
                    <p className="text-gray-400 mt-2 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs uppercase tracking-wider text-purple-400 font-bold">
                            {user.funcao === 'admin' ? 'Administrador' : 'Membro'}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-sm italic tracking-wide">Média mensal: {user.escalacao || 2} escalas</span>
                    </p>
                </div>

                {/* Botão de Exportação (Apenas para Admin) */}
                {user.funcao === 'admin' && (
                    <ExportPdfButton monthStr={monthStr} />
                )}
            </div>

            {/* Grid de Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
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

            {/* JUSTIFICATIVAS */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-5 md:p-6 rounded-[2.5rem] shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <span className="w-1.5 h-6 bg-purple-500 rounded-full" />
                    <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
                        Últimas Justificativas
                    </h2>
                </div>

                {stats.ultimasJustificativas.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-gray-500 text-sm">
                            Nenhuma desistência registrada recentemente.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* MOBILE — CARDS */}
                        <div className="space-y-4 md:hidden">
                            {stats.ultimasJustificativas.map(j => (
                                <div
                                    key={j.id}
                                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2"
                                >
                                    <div className="flex justify-between items-center">
              <span className="font-bold text-white text-sm">
                {j.user.username}
              </span>
                                        <span className="text-[10px] text-gray-500 font-mono">
                {new Date(j.timestamp).toLocaleDateString('pt-BR')}
              </span>
                                    </div>

                                    <p className="text-gray-400 text-sm italic leading-relaxed">
                                        “{j.justification}”
                                    </p>

                                    <div className="text-right text-[10px] text-gray-600 font-mono">
                                        {new Date(j.timestamp).toLocaleTimeString('pt-BR')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* DESKTOP — TABELA */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/5">
                                    <th className="pb-4 pl-2">Usuário</th>
                                    <th className="pb-4">Motivo da Ausência</th>
                                    <th className="pb-4 text-right pr-2">Data / Hora</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                {stats.ultimasJustificativas.map(j => (
                                    <tr key={j.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 pl-2 font-bold text-gray-200">
                                            {j.user.username}
                                        </td>
                                        <td className="py-4 text-gray-400 text-sm italic">
                                            “{j.justification}”
                                        </td>
                                        <td className="py-4 text-right pr-2 text-xs text-gray-500 font-mono">
                                            {new Date(j.timestamp).toLocaleString('pt-BR')}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}