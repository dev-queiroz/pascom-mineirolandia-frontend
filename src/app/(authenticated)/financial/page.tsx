'use client';

import React, { useState } from 'react';
import { useFinancial } from '@/hooks/useFinancial';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DollarSign, Upload, Calendar, CheckCircle2, Clock, AlertCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";

export default function FinancialPage() {
    const { user } = useAuth();
    const {
        createContribution,
        isCreating,
        pendings,
        isLoadingPendings,
        createExpense,
        isCreatingExpense
    } = useFinancial();

    const [type, setType] = useState<'entrada' | 'saida'>('entrada');
    const [form, setForm] = useState({ value: '', date: '', note: '' });
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (type === 'entrada') {
                const formData = new FormData();
                formData.append('value', form.value);
                formData.append('date', form.date);
                formData.append('note', form.note);
                if (file) formData.append('comprovante', file);

                await createContribution(formData);
                toast.success('Contribuição enviada para análise!');
            } else {
                const payload = {
                    value: Number(form.value.replace(',', '.')),
                    date: form.date,
                    note: form.note
                };

                await createExpense(payload);
                toast.success('Saída registrada com sucesso!');
            }

            setForm({ value: '', date: '', note: '' });
            setFile(null);
        } catch {
            toast.error('Erro ao processar operação. Tente novamente.');
        }
    };

    if (isLoadingPendings) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <LoadingSpinner />
        </div>
    );

    const isPending = isCreating || isCreatingExpense;

    return (
        <div className="space-y-8 px-4 sm:px-0 overflow-x-hidden animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    Gestão <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-500">Financeira</span>
                </h1>
                <p className="text-gray-400 mt-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Registre movimentações e acompanhe pendências
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                <div className="lg:col-span-5 bg-white/5 border border-white/10 backdrop-blur-md p-5 sm:p-6 lg:p-8 rounded-2xl lg:rounded-[2.5rem] shadow-2xl">
                    <div className="flex bg-black/20 p-1 rounded-xl mb-6">
                        <button
                            onClick={() => setType('entrada')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${type === 'entrada' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <ArrowUpCircle className="w-4 h-4" /> Entrada
                        </button>
                        <button
                            onClick={() => setType('saida')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${type === 'saida' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <ArrowDownCircle className="w-4 h-4" /> Saída
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-gray-400 ml-1">Valor da {type === 'entrada' ? 'Contribuição' : 'Saída'}</Label>
                            <div className="relative group">
                                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${type === 'entrada' ? 'text-emerald-500' : 'text-rose-500'}`}>R$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.value}
                                    onChange={e => setForm({ ...form, value: e.target.value })}
                                    className={`w-full bg-white/3 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 transition-all ${type === 'entrada' ? 'focus:ring-emerald-500/50' : 'focus:ring-rose-500/50'}`}
                                    placeholder="0,00"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-400 ml-1">Data</Label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    className="w-full bg-white/3 border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400 ml-1">Comprovante {type === 'saida' && '(Opcional)'}</Label>
                                <label className={`flex items-center justify-center w-full bg-white/3 border border-dashed border-white/20 rounded-2xl py-3 px-4 cursor-pointer hover:bg-white/5 transition-all group ${type === 'saida' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <Upload className={`w-5 h-5 ${file ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'}`} />
                                    <span className="ml-2 text-sm text-gray-400 truncate max-w-30">
                                        {file ? file.name : type === 'entrada' ? 'Anexar' : 'Indisponível'}
                                    </span>
                                    <input
                                        type="file"
                                        disabled={type === 'saida'}
                                        className="hidden"
                                        onChange={e => setFile(e.target.files?.[0] || null)}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-400 ml-1">Observação</Label>
                            <textarea
                                value={form.note}
                                onChange={e => setForm({ ...form, note: e.target.value })}
                                className="w-full bg-white/3 border border-white/10 rounded-2xl py-3 px-4 text-white min-h-25 focus:outline-none focus:ring-2 transition-all"
                                placeholder={type === 'entrada' ? "Descreva aqui..." : "Motivo da saída..."}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className={`w-full py-6 text-white font-bold rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                                type === 'entrada'
                                    ? 'bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-900/20'
                                    : 'bg-linear-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-rose-900/20'
                            }`}
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <LoadingSpinner className="w-4 h-4" />
                                    Processando...
                                </span>
                            ) : (
                                `Confirmar ${type === 'entrada' ? 'Envio' : 'Saída'}`
                            )}
                        </Button>
                    </form>
                </div>

                <div className="lg:col-span-7 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3 sticky top-0 bg-black/30 backdrop-blur-sm py-2 z-10">
                        <AlertCircle className="w-6 h-6 text-amber-400" />
                        Histórico de Pendências
                    </h2>

                    {pendings.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                            <CheckCircle2 className="w-12 h-12 mx-auto text-white/10 mb-4" />
                            <p className="text-gray-500 font-medium">Nenhuma pendência encontrada.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {pendings.map(item => (
                                <div
                                    key={item.id}
                                    className="group bg-white/5 border border-white/10 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-white/8 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'entrada' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                                            <DollarSign className={`w-6 h-6 ${item.type === 'entrada' ? 'text-emerald-400' : 'text-rose-400'}`} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">
                                                R$ {Number(item.value).toFixed(2)}
                                                <span className={`text-[10px] ml-2 px-2 py-0.5 rounded uppercase ${item.type === 'entrada' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                                    {item.type}
                                                </span>
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(item.date).toLocaleDateString('pt-BR')}
                                                </span>
                                                <span className="flex items-center gap-1 uppercase tracking-tighter bg-white/5 px-2 py-0.5 rounded text-[10px] text-amber-500 font-bold border border-amber-500/20">
                                                    <Clock className="w-3 h-3" /> {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {user?.funcao === 'admin' && (
                                        <div className="text-xs text-gray-500">
                                            Usuário: <span className="text-gray-300">{item.user?.username}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}