import { useState } from 'react';
import api from '../api';

export default function Financial() {
    const [form, setForm] = useState({ value: '', date: '', time: '', note: '' });
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append('value', form.value);
        data.append('date', form.date);
        data.append('time', form.time);
        data.append('note', form.note);
        if (file) data.append('comprovante', file);

        await api.post('/financial/contribution', data);
        alert('Enviado!');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Contribuição</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-lg">
                <input
                    type="number"
                    placeholder="Valor"
                    value={form.value}
                    onChange={e => setForm({...form, value: e.target.value})}
                    className="w-full p-3 mb-4 border rounded"
                    required
                />
                <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({...form, date: e.target.value})}
                    className="w-full p-3 mb-4 border rounded"
                    required
                />
                <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm({...form, time: e.target.value})}
                    className="w-full p-3 mb-4 border rounded"
                />
                <input
                    type="text"
                    placeholder="Nota"
                    value={form.note}
                    onChange={e => setForm({...form, note: e.target.value})}
                    className="w-full p-3 mb-4 border rounded"
                />
                <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="mb-6"
                />
                <button type="submit" className="w-full bg-green-600 text-white py-3 rounded">
                    Enviar
                </button>
            </form>
        </div>
    );
}