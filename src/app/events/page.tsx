'use client';

import { useEventsHook } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/common/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Calendar, UserCheck, UserX } from 'lucide-react';

export default function EventsPage() {
    const { user } = useAuth();
    const { events, isLoading, error, assignSlot, removeSlot, isAssigning, isRemoving } = useEventsHook('01');

    const handleAssign = async (eventId: number, slotOrder: number) => {
        try {
            await assignSlot({ eventId, slotOrder });
            alert('Vaga servida com sucesso!');
        } catch {
            alert('Erro ao servir vaga');
        }
    };

    const handleRemove = async (eventId: number, slotOrder: number) => {
        const justification = prompt('Justificativa obrigatória para desistir:');
        if (!justification?.trim()) return alert('Justificativa é obrigatória');

        try {
            await removeSlot({ eventId, slotOrder, justification });
            alert('Desistência registrada!');
        } catch {
            alert('Erro ao desistir da vaga');
        }
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-red-600 text-center text-xl">Erro ao carregar escalas: {error.message}</div>;

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-4xl font-bold flex items-center gap-3">
                    <Calendar className="w-10 h-10 text-blue-600" />
                    Escalas do Mês
                </h1>
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Atualizar
                </Button>
            </div>

            {events.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 p-12 rounded-2xl text-center shadow-lg">
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Nenhum evento escalado para este mês.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {events.map(event => (
                        <Card key={event.id} title={event.description || 'Evento sem descrição'}>
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <div>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                                        {event.day}/{event.month} • {event.time}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        {event.location || 'Local não informado'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {event.slots.map(slot => (
                                    <div
                                        key={slot.id}
                                        className="flex justify-between items-center py-4 border-t border-gray-200 dark:border-gray-700"
                                    >
                                        <div>
                      <span className="font-medium">
                        {slot.order}. {slot.function || 'Função'} →
                      </span>{' '}
                                            <strong className={slot.user ? 'text-green-600' : 'text-red-600'}>
                                                {slot.user?.username || 'Vago'}
                                            </strong>
                                        </div>

                                        <div className="flex gap-3">
                                            {!slot.userId && (
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    onClick={() => handleAssign(event.id, slot.order)}
                                                    disabled={isAssigning}
                                                >
                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                    Servir vaga
                                                </Button>
                                            )}

                                            {slot.userId && slot.user?.username === user?.username && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleRemove(event.id, slot.order)}
                                                    disabled={isRemoving}
                                                >
                                                    <UserX className="mr-2 h-4 w-4" />
                                                    Desistir
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}