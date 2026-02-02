'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvent } from '@/hooks/useEvents';
import { useAdminEventMutations } from '@/mutations/eventMutations';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft, Calendar, MapPin, Clock, Edit2, X, Check, AlertTriangle, Plus, Trash2, LayoutDashboard, ChevronRight
} from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function EventDetailPage() {
    const { user: currentUser, isLoading: authLoading } = useAuth();
    const params = useParams();
    const router = useRouter();
    const { event, isLoading: eventLoading, error } = useEvent(Number(params.id));
    const { updateEvent, isPending } = useAdminEventMutations();

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        description: '',
        day: '',
        month: '',
        time: '',
        location: '',
        slots: [] as { id?: number; function: string; order: number }[]
    });

    useEffect(() => {
        if (!authLoading && (!currentUser || currentUser.funcao !== 'admin')) {
            toast.error("Acesso restrito.");
            router.back();
        }
    }, [currentUser, authLoading, router]);

    const startEditing = () => {
        if (!event) return;
        setEditForm({
            description: event.description ?? '',
            day: event.day ?? '',
            month: event.month ?? '',
            time: event.time ?? '',
            location: event.location ?? '',
            slots: [...event.slots].sort((a,b) => a.order - b.order).map(s => ({
                id: s.id,
                function: s.function ?? '',
                order: s.order
            }))
        });
        setIsEditing(true);
    };

    const handleAddSlot = () => {
        const nextOrder = editForm.slots.length > 0
            ? Math.max(...editForm.slots.map(s => s.order)) + 1
            : 1;
        setEditForm({
            ...editForm,
            slots: [...editForm.slots, { function: '', order: nextOrder }]
        });
    };

    const handleRemoveSlot = (index: number) => {
        const updatedSlots = editForm.slots.filter((_, i) => i !== index);
        setEditForm({ ...editForm, slots: updatedSlots });
    };

    const handleSlotChange = (index: number, value: string) => {
        const updatedSlots = [...editForm.slots];
        updatedSlots[index].function = value;
        setEditForm({ ...editForm, slots: updatedSlots });
    };

    const handleSave = async () => {
        try {
            // Sincronização com o Backend: Novos slots não podem ter ID 0 ou null
            const sanitizedSlots = editForm.slots.map(slot => {
                if (!slot.id) {
                    const { id, ...rest } = slot;
                    return rest;
                }
                return slot;
            });

            const payload = {
                ...editForm,
                slots: sanitizedSlots,
            };

            await updateEvent({ id: event!.id, data: payload });

            toast.success('Evento atualizado com sucesso!');
            setIsEditing(false);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Erro ao atualizar';
            toast.error(msg, { icon: <AlertTriangle className="w-4 h-4" /> });
        }
    };

    if (authLoading || eventLoading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
    if (currentUser?.funcao !== 'admin') return null;
    if (error || !event) return <div className="text-center py-20 text-rose-500 italic font-bold">Evento não encontrado.</div>;

    const slotsFilled = event.slots.filter(s => s.user).length;
    const totalSlots = event.slots.length;
    const percentFilled = totalSlots ? (slotsFilled / totalSlots) * 100 : 0;

    return (
        <div className="max-w-5xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500 pb-20">

            {/* Top Navigation / Breadcrumb */}
            <div className="flex items-center justify-between">
                <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <button onClick={() => router.push('/admin/events')} className="hover:text-white transition-colors">Eventos</button>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-indigo-400 truncate max-w-[150px] sm:max-w-none">Detalhes</span>
                </nav>

                {!isEditing && (
                    <Button
                        onClick={startEditing}
                        disabled={isPending}
                        className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-600/20 rounded-2xl px-6 font-bold"
                    >
                        <Edit2 className="w-4 h-4 mr-2" /> Editar
                    </Button>
                )}
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full" />

                {!isEditing ? (
                    <div className="space-y-10">
                        {/* Event Header Info */}
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">Escala Ativa</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter mb-8 leading-none">
                                {event.description || 'Sem descrição'}
                            </h1>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] group hover:border-indigo-500/20 transition-all">
                                    <Calendar className="w-6 h-6 text-indigo-400 mb-3" />
                                    <p className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-1">Data</p>
                                    <p className="text-xl text-white font-black">{event.day}/{event.month}</p>
                                </div>
                                <div className="p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] group hover:border-purple-500/20 transition-all">
                                    <Clock className="w-6 h-6 text-purple-400 mb-3" />
                                    <p className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-1">Horário</p>
                                    <p className="text-xl text-white font-black">{event.time}</p>
                                </div>
                                <div className="p-5 bg-white/[0.03] border border-white/5 rounded-[2rem] group hover:border-cyan-500/20 transition-all">
                                    <MapPin className="w-6 h-6 text-cyan-400 mb-3" />
                                    <p className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-1">Local</p>
                                    <p className="text-xl text-white font-black truncate">{event.location || '---'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Occupation Stats */}
                        <div className="p-8 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-[2.5rem]">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black mb-1">Engajamento</p>
                                    <h3 className="text-white font-black text-2xl italic">Status de Ocupação</h3>
                                </div>
                                <div className="text-right">
                                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{slotsFilled}</span>
                                    <span className="text-gray-600 font-black text-xl"> / {totalSlots}</span>
                                </div>
                            </div>
                            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                                    style={{ width: `${percentFilled}%` }}
                                />
                            </div>
                        </div>

                        {/* Slots List */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-white italic tracking-tight px-2">Configuração da Escala</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {event.slots.sort((a, b) => a.order - b.order).map((slot) => (
                                    <div key={slot.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] flex items-center justify-between group hover:bg-white/[0.05] hover:border-white/10 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-black text-gray-500 border border-white/5">
                                                {slot.order}
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-indigo-400/70 tracking-widest mb-0.5">{slot.function || 'Vaga'}</p>
                                                <p className={`text-lg font-bold ${slot.user ? 'text-white' : 'text-gray-700 italic font-medium text-base'}`}>
                                                    {slot.user?.username || 'Disponível'}
                                                </p>
                                            </div>
                                        </div>
                                        {slot.user && (
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-emerald-500" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                                <Edit2 className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white italic leading-tight">Editor de Evento</h1>
                                <p className="text-gray-500 text-sm font-medium">Atualize as informações e vagas da escala</p>
                            </div>
                        </div>

                        <div className="grid gap-8">
                            {/* Campos principais */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-400 font-bold text-xs uppercase tracking-widest ml-1">Descrição</Label>
                                    <Input
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-16 text-lg text-white focus:ring-indigo-500/50"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-gray-400 font-bold text-xs uppercase tracking-widest ml-1">Dia</Label>
                                        <Input
                                            value={editForm.day}
                                            onChange={(e) => setEditForm({ ...editForm, day: e.target.value })}
                                            className="bg-white/5 border-white/10 rounded-2xl h-14"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-400 font-bold text-xs uppercase tracking-widest ml-1">Mês</Label>
                                        <Input
                                            value={editForm.month}
                                            onChange={(e) => setEditForm({ ...editForm, month: e.target.value })}
                                            className="bg-white/5 border-white/10 rounded-2xl h-14"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-400 font-bold text-xs uppercase tracking-widest ml-1">Horário</Label>
                                        <Input
                                            value={editForm.time}
                                            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                                            className="bg-white/5 border-white/10 rounded-2xl h-14"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-400 font-bold text-xs uppercase tracking-widest ml-1">Localização</Label>
                                    <Input
                                        value={editForm.location}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        className="bg-white/5 border-white/10 rounded-2xl h-14"
                                    />
                                </div>
                            </div>

                            {/* Seção de Slots */}
                            <div className="pt-10 border-t border-white/5">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-black text-white italic tracking-tight">Gerenciar Vagas</h2>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleAddSlot}
                                        className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-xl font-bold h-10"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Novo Slot
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {editForm.slots.map((slot, index) => (
                                        <div key={index} className="group p-2 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-4 transition-all focus-within:border-indigo-500/40 focus-within:bg-white/[0.05]">
                                            <div className="w-12 h-12 flex-shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-xs font-black text-gray-600 border border-white/5">
                                                {slot.order}
                                            </div>
                                            <Input
                                                value={slot.function}
                                                onChange={(e) => handleSlotChange(index, e.target.value)}
                                                className="bg-transparent border-none focus-visible:ring-0 text-white text-lg placeholder:text-gray-800 h-12 flex-1 font-bold"
                                                placeholder="Função (ex: Fotógrafo)"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveSlot(index)}
                                                className="text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl mr-2"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    ))}
                                    {editForm.slots.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.01]">
                                            <p className="text-gray-600 font-medium">Nenhum slot definido para este evento.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-10">
                            <Button
                                onClick={handleSave}
                                disabled={isPending}
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black h-16 rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all text-lg"
                            >
                                {isPending ? <LoadingSpinner className="w-6 h-6 mr-2" /> : <Check className="w-6 h-6 mr-2" />}
                                ATUALIZAR ESCALA
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setIsEditing(false)}
                                disabled={isPending}
                                className="sm:w-40 h-16 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl font-bold text-lg"
                            >
                                CANCELAR
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}