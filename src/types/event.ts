export interface Slot {
    id: number;
    eventId: number;
    function?: string;
    userId?: number | null;
    order: number;
    user?: { username: string };
}

export interface Event {
    id: number;
    month: string; // '01'..'12'
    day: string;
    time: string; // 'HH:mm'
    description?: string;
    location?: string;
    createdAt: string;
    slots: Slot[];
}