'use client';

import { useState } from 'react';
import { useFinancial } from '@/hooks/useFinancial';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DollarSign, Upload, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import {useAuth} from "@/hooks/useAuth";

export default function FinancialPage() {
    const { user } = useAuth();
    const { createContribution, isCreating, pendings, isLoadingPendings } = useFinancial();
    const [form, setForm] = useState({ value: '', date: '', note: '' });
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('value', form.value);
        formData.append('date', form.date);
        formData.append('note', form.note);
        if (file) formData.append('comprovante', file);

        try {
            await createContribution(formData);
            setForm({ value: '', date: '', note: '' });
            setFile(null);
            toast.success('Contribuição enviada com sucesso!');
        } catch {
            toast.error('Erro ao enviar contribuição. Tente novamente.');
        }
    };

    if (isLoadingPendings) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <LoadingSpinner />
        </div>
    );

    return (
        <div className="space-y-8 px-4 sm:px-0 overflow-x-hidden animate-in fade-in duration-500">
            {/* Header da Página */}
            <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    Gestão <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Financeira</span>
                </h1>
                <p className="text-gray-400 mt-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Envie comprovantes e acompanhe suas pendências
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                {/* Formulário (Lado Esquerdo) */}
                <div className="lg:col-span-5 bg-white/5 border border-white/10 backdrop-blur-md p-5 sm:p-6 lg:p-8 rounded-2xl lg:rounded-[2.5rem] shadow-2xl">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3 sticky top-0 bg-black/30 backdrop-blur-sm py-2 z-10">
                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                        Nova Contribuição
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-gray-400 ml-1">Valor da Contribuição</Label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">R$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.value}
                                    onChange={e => setForm({ ...form, value: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
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
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400 ml-1">Comprovante</Label>
                                <label className="flex items-center justify-center w-full bg-white/[0.03] border border-dashed border-white/20 rounded-2xl py-3 px-4 cursor-pointer hover:bg-white/[0.05] transition-all group">
                                    <Upload className={`w-5 h-5 ${file ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'}`} />
                                    <span className="ml-2 text-sm text-gray-400 truncate max-w-[120px]">
                                        {file ? file.name : 'Anexar comprovante'}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={e => setFile(e.target.files?.[0] || null)}
                                    />
                                </label>

                                {file && (
                                    <p className="text-[11px] text-emerald-400 mt-1 ml-1">
                                        Arquivo anexado com sucesso
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-400 ml-1">Observação</Label>
                            <textarea
                                value={form.note}
                                onChange={e => setForm({ ...form, note: e.target.value })}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 px-4 text-white min-h-[100px] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                placeholder="Descreva aqui (opcional)..."
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isCreating}
                            className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isCreating ? (
                                <span className="flex items-center gap-2">
                                    <LoadingSpinner className="w-4 h-4" />
                                    Enviando...
                                </span>
                            ) : (
                                'Confirmar Envio'
                            )}

                        </Button>
                    </form>
                </div>

                {/* Listagem de Pendências (Lado Direito) */}
                <div className="lg:col-span-7 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3 sticky top-0 bg-black/30 backdrop-blur-sm py-2 z-10">
                    <AlertCircle className="w-6 h-6 text-amber-400" />
                        Histórico de Pendências
                    </h2>

                    {pendings.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                            <CheckCircle2 className="w-12 h-12 mx-auto text-white/10 mb-4" />
                            <p className="text-gray-500 font-medium">Você está em dia! Nenhuma pendência encontrada.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {pendings.map(item => (
                                <div
                                    key={item.id}
                                    className="group bg-white/5 border border-white/10 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-white/[0.08] transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                            <DollarSign className="text-emerald-400 w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">
                                                R$ {Number(item.value).toFixed(2)}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1 text-xs sm:text-sm">
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