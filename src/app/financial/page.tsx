'use client';

import { useState } from 'react';
import { useFinancial } from '@/hooks/useFinancial';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {Label} from "@/components/ui/label";

export default function FinancialPage() {
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
            alert('Contribuição enviada com sucesso!');
            setForm({ value: '', date: '', note: '' });
            setFile(null);
        } catch {
            alert('Erro ao enviar contribuição');
        }
    };

    if (isLoadingPendings) return <LoadingSpinner />;

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Contribuição Financeira</h1>

            <Card title="Nova Contribuição">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Valor (R$)"
                        type="number"
                        step="0.01"
                        value={form.value}
                        onChange={e => setForm({ ...form, value: e.target.value })}
                        placeholder="Ex: 150.00"
                        required
                    />

                    <Input
                        label="Data"
                        type="date"
                        value={form.date}
                        onChange={e => setForm({ ...form, date: e.target.value })}
                        required
                    />

                    <Input
                        label="Observação (opcional)"
                        value={form.note}
                        onChange={e => setForm({ ...form, note: e.target.value })}
                        placeholder="Ex: Doação mensal"
                    />

                    <div>
                        <Label>Comprovante (JPG/PNG/PDF, máx 5MB)</Label>
                        <Input
                            type="file"
                            accept="image/jpeg,image/png,application/pdf"
                            onChange={e => setFile(e.target.files?.[0] || null)}
                            className="mt-2"
                        />
                    </div>

                    <Button type="submit" disabled={isCreating} className="w-full">
                        {isCreating ? 'Enviando...' : 'Enviar Contribuição'}
                    </Button>
                </form>
            </Card>

            <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">Pendências</h2>
                {pendings.length === 0 ? (
                    <p className="text-gray-500">Nenhuma pendência no momento.</p>
                ) : (
                    <div className="space-y-6">
                        {pendings.map(item => (
                            <Card key={item.id} title={`Contribuição - R$ ${item.value}`}>
                                <p>Data: {item.date}</p>
                                <p>Usuário: {item.user?.username}</p>
                                <p>Status: {item.status}</p>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}