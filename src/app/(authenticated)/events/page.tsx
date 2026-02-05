'use client';

import { useState } from 'react';
import { useEventsHook } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { extrasService } from '@/services/extrasService';
import {
    Calendar,
    UserCheck,
    UserX,
    RefreshCw,
    MapPin,
    Clock,
    AlertTriangle,
    CalendarPlus
} from 'lucide-react';
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";

export default function EventsPage() {
    const { user } = useAuth();
    const currentMonth = new Date().getMonth() + 1;
    const {
        events,
        isFirstLoading,
        isUpdating,
        error,
        assignSlot,
        removeSlot,

        isRemoving,
        refetch
    } = useEventsHook(currentMonth.toString().padStart(2, '0'));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [justification, setJustification] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<{ eventId: number; slotOrder: number } | null>(null);
    const [loadingSlotKey, setLoadingSlotKey] = useState<string | null>(null);

    const handleAssign = async (eventId: number, slotOrder: number) => {
        const key = `${eventId}-${slotOrder}`;
        setLoadingSlotKey(key);

        try {
            await assignSlot({ eventId, slotOrder });
            toast.success('Serviço registrado com sucesso');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao servir vaga';

            toast.error(errorMessage, {
                icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
                style: {
                    background: '#1a1010',
                    border: '1px solid #442222',
                    color: '#ff8888'
                }
            });
        } finally {
            setLoadingSlotKey(null);
        }
    };

    const handleOpenRemoveModal = (eventId: number, slotOrder: number) => {
        setSelectedSlot({ eventId, slotOrder });
        setJustification('');
        setIsModalOpen(true);
    };

    const handleConfirmRemove = async () => {
        if (!selectedSlot || !justification.trim()) {
            toast.error('A justificativa é obrigatória');
            return;
        }

        const key = `${selectedSlot.eventId}-${selectedSlot.slotOrder}`;
        setLoadingSlotKey(key);

        try {
            await removeSlot({
                eventId: selectedSlot.eventId,
                slotOrder: selectedSlot.slotOrder,
                justification
            });
            toast.success('Desistência registrada');
            setIsModalOpen(false);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao desistir de vaga';
            toast.error(errorMessage);
        } finally {
            setLoadingSlotKey(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                        Escalas do <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-500">Mês</span>
                    </h1>
                    <p className="text-gray-400 mt-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        Confira e selecione suas participações
                    </p>
                </div>

                <Button
                    onClick={() => refetch()}
                    disabled={isUpdating}
                    className="bg-white/5! hover:bg-white/10! border-white/10! backdrop-blur-md text-white gap-2 rounded-xl transition-all"
                >
                    <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
                    Atualizar Dados
                </Button>
            </div>

            {isFirstLoading && (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center backdrop-blur-md">
                    <p className="font-bold text-lg">Ops! Erro de conexão</p>
                    <p className="text-sm opacity-80">{error.message}</p>
                </div>
            )}

            {!isFirstLoading && !error && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {events.length === 0 ? (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-4xl">
                            <p className="text-gray-500">Nenhuma escala disponível no momento.</p>
                        </div>
                    ) : (
                        events.map(event => (
                            <div
                                key={event.id}
                                className="bg-white/5 border border-white/10 backdrop-blur-md p-4 sm:p-5 lg:p-6 rounded-2xl lg:rounded-4xl shadow-2xl flex flex-col group hover:border-purple-500/30 transition-all duration-300"
                            >
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                                        {event.description || `Escala ${event.day}/${event.month}`}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <span className="flex items-center gap-1.5 text-gray-400">
                                            <Calendar className="w-4 h-4 text-indigo-400" />
                                            {event.day}/{event.month}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-gray-400">
                                            <Clock className="w-4 h-4 text-indigo-400" />
                                            {event.time}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-gray-400">
                                            <MapPin className="w-4 h-4 text-indigo-400" />
                                            {event.location}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {event.slots.map(slot => (
                                        <div key={slot.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white/3 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Slot {slot.order} • {slot.function}</span>
                                                <span className={`font-medium ${slot.user ? 'text-indigo-300' : 'text-rose-400/80 italic text-sm'}`}>
                                                    {slot.user?.username || 'Vaga disponível'}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 justify-end">
                                                {!slot.userId ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAssign(event.id, slot.order)}
                                                        disabled={loadingSlotKey === `${event.id}-${slot.order}`}
                                                        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl px-4"
                                                    >
                                                        {loadingSlotKey === `${event.id}-${slot.order}` ? (
                                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <UserCheck className="w-4 h-4 mr-2" /> Servir
                                                            </>
                                                        )}
                                                    </Button>
                                                ) : slot.user?.username === user?.username && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => extrasService.downloadIcs(event.id)}
                                                            className="bg-white/5 border-white/10 text-gray-400 hover:text-white rounded-xl h-9"
                                                            title="Adicionar ao Calendário"
                                                        >
                                                            <CalendarPlus className="w-4 h-4" />
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleOpenRemoveModal(event.id, slot.order)}
                                                            disabled={loadingSlotKey === `${event.id}-${slot.order}`}
                                                            className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl"
                                                        >
                                                            <UserX className="w-4 h-4 mr-2" />
                                                            Sair
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <AlertDialogContent className="bg-gray-900/95 border-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl w-[95vw] sm:w-full border">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-rose-500/20 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-rose-500" />
                            </div>
                            <AlertDialogTitle className="text-2xl font-black text-white">
                                Confirmar Saída
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-gray-400 text-base">
                            Você está prestes a desistir desta escala. Para prosseguir, descreva o motivo da sua ausência abaixo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="py-4">
                        <Textarea
                            placeholder="Ex: Imprevisto profissional, motivo de saúde..."
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-2xl min-h-25 focus:ring-rose-500/50 transition-all focus:outline-none"
                        />
                    </div>

                    <AlertDialogFooter className="flex-col sm:flex-row gap-3">
                        <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl py-6 border transition-colors">
                            Voltar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleConfirmRemove();
                            }}
                            disabled={isRemoving || !justification.trim()}
                            className="bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-2xl py-6 shadow-lg shadow-rose-900/20 border-none transition-all"
                        >
                            {isRemoving ? 'Removendo...' : 'Confirmar Desistência'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}