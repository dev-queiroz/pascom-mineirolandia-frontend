import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

interface SummaryCardsProps {
    data: { entradas: number; saidas: number; saldo: number };
}

export function SummaryCards({ data }: SummaryCardsProps) {
    const cards = [
        { label: 'Entradas', val: data.entradas, color: 'text-emerald-400', icon: ArrowUpCircle, bg: 'bg-emerald-500/10' },
        { label: 'Saídas', val: data.saidas, color: 'text-rose-400', icon: ArrowDownCircle, bg: 'bg-rose-500/10' },
        { label: 'Saldo Atual', val: data.saldo, color: 'text-cyan-400', icon: Wallet, bg: 'bg-cyan-500/10' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card) => (
                <div key={card.label} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${card.bg}`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{card.label}</p>
                            <p className={`text-2xl font-black ${card.color}`}>
                                R$ {Number(card.val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}