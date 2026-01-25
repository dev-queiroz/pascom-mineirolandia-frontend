import { useEffect, useState } from 'react';
import api from '../api';

export default function Events() {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        api.get('/events?month=01').then(res => setEvents(res.data));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Escalas do Mês</h1>
            {events.length === 0 ? (
                <p>Nenhum evento encontrado.</p>
            ) : (
                events.map(event => (
                    <div key={event.id} className="bg-white p-4 mb-4 rounded shadow">
                        <p className="font-semibold">{event.description}</p>
                        <p>{event.day}/{event.month} - {event.time}</p>
                        <p>Local: {event.location}</p>
                    </div>
                ))
            )}
        </div>
    );
}