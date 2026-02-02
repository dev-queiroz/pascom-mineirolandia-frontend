'use client';

import { useEffect, useState } from 'react';
import { useEventsHook } from '@/hooks/useEvents';
import { useAdminEventMutations } from '@/mutations/eventMutations';
import { extrasService } from '@/services/extrasService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { toast } from "sonner";
import {
    Plus, Trash2, Calendar as CalendarIcon,
    Clock, MapPin, Users, X, MessageSquare, AlertTriangle, ChevronRight
} from 'lucide-react';
import { CreateEventDTO } from "@/types";
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
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AdminEventsPage() {
    const { user: currentUser, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { events, isFirstLoading: eventsLoading } = useEventsHook();
    const { createEvent, deleteEvent, isPending } = useAdminEventMutations();

    const [isAdding, setIsAdding] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<number | null>(null);
    const [newSlots, setNewSlots] = useState<{ function: string }[]>([{ function: '' }]);
    const [formData, setFormData] = useState<Omit<CreateEventDTO, 'slots'>>({
        description: '',
        day: '',
        month: '',
        time: '',
        location: ''
    });

    useEffect(() => {
        if (!authLoading && (!currentUser || currentUser.funcao !== 'admin')) {
            toast.error("Acesso restrito a administradores.");
            router.back();
        }
    }, [currentUser, authLoading, router]);

    const handleAddSlot = () => setNewSlots([...newSlots, { function: '' }]);
    const handleRemoveSlot = (index: number) =>
        setNewSlots(newSlots.filter((_, i) => i !== index));

    const handleWhatsAppConvocacao = async (month: string, day: string) => {
        try {
            const links = await extrasService.getWhatsAppLinks(month);
            const specificLink = links.find(link => link.includes(day)) || links[0];
            window.open(specificLink, '_blank');
            toast.success("Link do WhatsApp gerado!");
        } catch {
            toast.error("Erro ao gerar link do WhatsApp");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.time) {
            toast.error("O horário do evento é obrigatório");
            return;
        }

        const payload: CreateEventDTO = {
            ...formData,
            slots: newSlots.map((slot, index) => ({
                function: slot.function,
                order: index + 1
            }))
        };

        try {
            await createEvent(payload);
            toast.success('Evento criado com sucesso!');
            setIsAdding(false);
            setFormData({ description: '', day: '', month: '', time: '', location: '' });
            setNewSlots([{ function: '' }]);
        } catch {
            toast.error('Erro ao criar evento');
        }
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;
        try {
            await deleteEvent(eventToDelete);
            toast.success('Evento excluído com sucesso');
        } catch {
            toast.error('Erro ao excluir evento');
        } finally {
            setEventToDelete(null);
        }
    };

    if (authLoading || eventsLoading) {
        return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
    }

    if (currentUser?.funcao !== 'admin') return null;

    return (
        <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700 pb-20">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] uppercase tracking-widest text-indigo-400 font-bold">
                            Painel de Controle
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic">
                        Gestão de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Escalas</span>
                    </h1>
                </div>

                {!isAdding && (
                    <Button
                        onClick={() => setIsAdding(true)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl px-8 h-14 font-bold shadow-xl shadow-indigo-500/20 transition-all gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Novo Evento
                    </Button>
                )}
            </div>

            {/* Formulário de Adição (Glass Card) */}
            {isAdding && (
                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-6 sm:p-10 shadow-2xl animate-in slide-in-from-top-6 duration-500 relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full" />

                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-white italic flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            Novo Evento
                        </h2>
                        <Button
                            variant="ghost"
                            onClick={() => setIsAdding(false)}
                            className="text-gray-500 hover:text-white hover:bg-white/5 rounded-full w-10 h-10 p-0"
                        >
                            <X className="w-6 h-6" />
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-gray-400 ml-1 font-bold text-xs uppercase tracking-widest">Descrição</Label>
                                <Input
                                    required
                                    placeholder="Ex: Missa Solene de Páscoa"
                                    className="bg-white/5 border-white/10 rounded-2xl h-14 text-white focus:ring-indigo-500/50"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-400 ml-1 font-bold text-xs uppercase tracking-widest">Dia</Label>
                                    <Input placeholder="25" required className="h-12 bg-white/5 border-white/10 rounded-xl"
                                           value={formData.day}
                                           onChange={e => setFormData({ ...formData, day: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400 ml-1 font-bold text-xs uppercase tracking-widest">Mês</Label>
                                    <Input placeholder="04" required className="h-12 bg-white/5 border-white/10 rounded-xl"
                                           value={formData.month}
                                           onChange={e => setFormData({ ...formData, month: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400 ml-1 font-bold text-xs uppercase tracking-widest">Hora</Label>
                                    <Input type="time" required className="h-12 bg-white/5 border-white/10 rounded-xl text-white"
                                           value={formData.time}
                                           onChange={e => setFormData({ ...formData, time: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-400 ml-1 font-bold text-xs uppercase tracking-widest">Localização</Label>
                                <Input
                                    required
                                    placeholder="Ex: Matriz de Pedra Branca"
                                    className="bg-white/5 border-white/10 rounded-2xl h-14 text-white focus:ring-indigo-500/50"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-6 flex flex-col">
                            <div className="flex justify-between items-center ml-1">
                                <Label className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                                    Configuração de Vagas
                                </Label>
                                <button
                                    type="button"
                                    onClick={handleAddSlot}
                                    className="text-indigo-400 hover:text-indigo-300 text-xs font-black uppercase tracking-tighter transition-colors"
                                >
                                    + Adicionar Slot
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {newSlots.map((slot, index) => (
                                    <div key={index} className="flex gap-2 group animate-in fade-in slide-in-from-left-2">
                                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-xs font-black text-gray-500">
                                            {index + 1}
                                        </div>
                                        <Input
                                            required
                                            placeholder="Ex: Fotógrafo"
                                            className="bg-white/5 border-white/10 rounded-xl h-12 flex-1"
                                            value={slot.function}
                                            onChange={e => {
                                                const updated = [...newSlots];
                                                updated[index].function = e.target.value;
                                                setNewSlots(updated);
                                            }}
                                        />
                                        {newSlots.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => handleRemoveSlot(index)}
                                                className="text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 mt-auto">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black h-14 rounded-2xl shadow-lg transition-all"
                                >
                                    {isPending ? <LoadingSpinner className="w-5 h-5" /> : 'CRIAR EVENTO AGORA'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Grid de Listagem (Glass Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <div key={event.id} className="group bg-white/5 border border-white/10 p-6 rounded-[2.5rem] hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <CalendarIcon className="w-7 h-7 text-indigo-400" />
                            </div>

                            <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleWhatsAppConvocacao(event.month, event.day);
                                    }}
                                    className="text-emerald-500 hover:bg-emerald-500/10 rounded-xl"
                                    title="Convocação WhatsApp"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setEventToDelete(event.id);
                                    }}
                                    className="text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        <Link href={`/admin/events/${event.id}`} className="flex-1">
                            <div className="space-y-3">
                                <h3 className="text-xl font-black text-white italic tracking-tight group-hover:text-indigo-400 transition-colors">
                                    {event.description || 'Evento sem título'}
                                </h3>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-400 font-bold">
                                        <Clock className="w-4 h-4 text-purple-400" />
                                        {event.day}/{event.month} • {event.time}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium line-clamp-1">
                                        <MapPin className="w-4 h-4 text-cyan-400" />
                                        {event.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase tracking-widest pt-2">
                                        <Users className="w-4 h-4" />
                                        {event.slots.length} Vagas Disponíveis
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                            <Link href={`/admin/events/${event.id}`} className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
                                Gerenciar Escala <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dialog de Exclusão Refinado */}
            <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
                <AlertDialogContent className="bg-gray-900/95 border border-white/10 backdrop-blur-xl rounded-[2.5rem] max-w-[90vw] sm:max-w-lg shadow-2xl p-8">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center">
                                <AlertTriangle className="w-7 h-7 text-rose-500" />
                            </div>
                            <AlertDialogTitle className="text-2xl font-black text-white italic">
                                Confirmar Exclusão
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-gray-400 text-base leading-relaxed">
                            Você tem certeza que deseja excluir permanentemente este evento? Todas as escalas e membros vinculados serão removidos. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-8">
                        <AlertDialogCancel className="bg-white/5 border-white/10 text-white rounded-2xl h-14 font-bold hover:bg-white/10 transition-all border-none">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-rose-600 hover:bg-rose-500 text-white font-black h-14 rounded-2xl shadow-lg shadow-rose-900/20 border-none transition-all"
                        >
                            EXCLUIR AGORA
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}