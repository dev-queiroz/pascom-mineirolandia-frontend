'use client';

import { useEffect, useState } from 'react';
import { useFinancial } from '@/hooks/useFinancial';
import { useFinancialSummary } from '@/queries/financialQueries';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SummaryCards } from '@/components/common/SummaryCards';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import {
    Check,
    X,
    Eye,
    FileText,
    User,
    Calendar as CalendarIcon,
    AlertCircle,
    ArrowUpRight,
    Trash2,
    Filter,
    ArrowDownCircle,
    Plus
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AdminFinancialPage() {
    const { user: currentUser, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const {
        pendings,
        isLoadingPendings,
        confirmContribution,
        isConfirming,
        deleteContribution,
        isDeleting,
        createExpense,
        isCreatingExpense
    } = useFinancial();

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
    const [expenseForm, setExpenseForm] = useState({ value: '', date: new Date().toISOString().split('T')[0], note: '' });
    const currentMonthStr = new Date().toISOString().substring(0, 7);
    const [filterMonth, setFilterMonth] = useState(currentMonthStr);

    const { data: summary, isLoading: isLoadingSummary, refetch: refetchSummary } = useFinancialSummary(filterMonth);

    useEffect(() => {
        if (!authLoading && (!currentUser || currentUser.funcao !== 'admin')) {
            toast.error("Acesso negado.");
            router.replace('/dashboard');
        }
    }, [currentUser, authLoading, router]);

    const handleConfirm = async (id: number) => {
        try {
            await confirmContribution(id);
            toast.success('Contribuição confirmada!');
            refetchSummary();
        } catch {
            toast.error('Erro ao confirmar contribuição.');
        }
    };

    const handleDelete = async () => {
        if (!idToDelete) return;
        try {
            await deleteContribution(idToDelete);
            toast.success('Registro removido com sucesso.');
            refetchSummary();
        } catch {
            toast.error('Erro ao remover registro.');
        } finally {
            setIdToDelete(null);
        }
    };

    const handleExpenseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                value: Number(expenseForm.value.replace(',', '.')),
                date: expenseForm.date,
                note: expenseForm.note,
            };

            await createExpense(payload);

            toast.success('Saída registrada com sucesso!');

            setExpenseForm({
                value: '',
                date: new Date().toISOString().split('T')[0],
                note: ''
            });
            setIsExpenseDialogOpen(false);
            refetchSummary();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao registrar saída. Verifique os dados.');
        }
    };

    if (isLoadingPendings || authLoading) {
        return <div className="flex justify-center items-center h-[60vh]">
            <LoadingSpinner />
        </div>;
    }

    if (currentUser?.funcao !== 'admin') return null;

    return (
        <div className="space-y-10 pb-24 px-4 sm:px-6 lg:px-0 max-w-[1400px] mx-auto animate-in fade-in">

            {/* Header + Filtro + Ações */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tight">
                        Gestão <span className="text-amber-500">Financeira</span>
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Controle de entradas, saídas e validação.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Botão Nova Saída */}
                    <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl h-12 px-6 gap-2 transition-all active:scale-95 shadow-lg shadow-rose-900/20">
                                <ArrowDownCircle className="w-5 h-5" />
                                Registrar Saída
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2.5rem] bg-gray-900 border-white/10 text-white max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black italic uppercase text-rose-500 flex items-center gap-2">
                                    <Plus /> Nova Despesa
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleExpenseSubmit} className="space-y-6 pt-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400 ml-1">Valor da Saída</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 font-bold">R$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={expenseForm.value}
                                            onChange={e => setExpenseForm({...expenseForm, value: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                                            placeholder="0,00"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400 ml-1">Data do Pagamento</Label>
                                    <input
                                        type="date"
                                        required
                                        value={expenseForm.date}
                                        onChange={e => setExpenseForm({...expenseForm, date: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400 ml-1">Descrição / Motivo</Label>
                                    <textarea
                                        required
                                        value={expenseForm.note}
                                        onChange={e => setExpenseForm({...expenseForm, note: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white min-h-[100px] focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                                        placeholder="Ex: Compra de materiais, manutenção..."
                                    />
                                </div>
                                <Button
                                    disabled={isCreatingExpense}
                                    type="submit"
                                    className="w-full h-14 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-lg shadow-lg shadow-rose-900/40"
                                >
                                    {isCreatingExpense ? <LoadingSpinner /> : 'Confirmar Saída'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Filtro de Período */}
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl w-full sm:w-auto h-12">
                        <div className="flex items-center gap-2 px-3 text-gray-400 border-r border-white/10">
                            <Filter className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase hidden sm:inline">Período</span>
                        </div>
                        <input
                            type="month"
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="bg-transparent text-white font-bold outline-none px-2 py-1 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Resumo */}
            {isLoadingSummary ? (
                <div className="h-32 flex items-center justify-center bg-white/5 rounded-[2rem] border border-white/10">
                    <LoadingSpinner />
                </div>
            ) : summary ? (
                <SummaryCards data={summary} />
            ) : null}

            <hr className="border-white/5" />

            {/* Pendências */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                        Aguardando Validação
                        <span className="text-xs bg-white/10 px-3 py-1 rounded-full border border-white/10">
                            {pendings.length}
                        </span>
                    </h2>

                    <div className="hidden md:flex bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-amber-500 text-sm font-bold">
                        Total: R$ {pendings.reduce((acc, curr) => acc + Number(curr.value), 0).toFixed(2)}
                    </div>
                </div>

                {pendings.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                        <Check className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold">Sem pendências</h3>
                        <p className="text-gray-500">Tudo validado.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {pendings.map(item => (
                            <div
                                key={item.id}
                                className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col hover:border-amber-500/30 transition-all"
                            >
                                {/* Comprovante */}
                                <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
                                    {item.receipt ? (
                                        <>
                                            <Image
                                                src={item.receipt}
                                                alt="Comprovante"
                                                fill
                                                sizes="(max-width: 640px) 100vw, 33vw"
                                                className="object-cover opacity-70 hover:opacity-100 transition-opacity"
                                            />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="absolute top-3 right-3 bg-black/60 rounded-full"
                                                onClick={() => setSelectedImage(item.receipt as string)}
                                            >
                                                <Eye />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-600">
                                            <FileText className="w-10 h-10 mb-2" />
                                            <span className="text-xs font-bold uppercase">Sem arquivo</span>
                                        </div>
                                    )}

                                    <div className="absolute top-3 left-3 bg-amber-500 text-black font-black px-3 py-1 rounded-lg text-sm">
                                        R$ {Number(item.value).toFixed(2)}
                                    </div>
                                </div>

                                {/* Conteúdo */}
                                <div className="p-5 sm:p-6 space-y-4 flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 font-bold">
                                                <User className="w-4 h-4 text-amber-500" />
                                                {item.user?.username}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <CalendarIcon className="w-3.5 h-3.5" />
                                                {new Date(item.date).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                        <ArrowUpRight className="text-white/20" />
                                    </div>

                                    {item.note && (
                                        <p className="text-sm text-gray-400 bg-white/5 p-3 rounded-xl italic line-clamp-2">
                                            “{item.note}”
                                        </p>
                                    )}

                                    {/* Ações */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto pt-2">
                                        <Button
                                            disabled={isConfirming || isDeleting}
                                            onClick={() => handleConfirm(item.id)}
                                            className="h-12 bg-emerald-600 hover:bg-emerald-500 font-bold"
                                        >
                                            <Check className="w-4 h-4 mr-2" /> Validar
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            disabled={isConfirming || isDeleting}
                                            onClick={() => setIdToDelete(item.id)}
                                            className="h-12 text-rose-500 border border-rose-500/20 hover:bg-rose-500/10 font-bold"
                                        >
                                            <X className="w-4 h-4 mr-2" /> Recusar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <Image
                        src={selectedImage}
                        alt="Comprovante ampliado"
                        width={1200}
                        height={800}
                        className="max-h-[90vh] w-auto rounded-2xl object-contain"
                    />
                </div>
            )}

            {/* Modal Exclusão */}
            <AlertDialog open={!!idToDelete} onOpenChange={() => setIdToDelete(null)}>
                <AlertDialogContent className="rounded-[2rem] bg-gray-900 border-white/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-3 text-rose-500 text-xl font-black italic">
                            <Trash2 /> Excluir registro?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            Esta ação é permanente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="rounded-xl bg-rose-500 hover:bg-rose-600"
                        >
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
