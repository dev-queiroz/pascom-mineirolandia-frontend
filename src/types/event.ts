import {User} from "@/types/user";

export interface Slot {
    id: number;
    eventId: number;
    function?: string | null;
    userId?: number | null;
    order: number;
    user?: Pick<User, 'username'> | null;
}

export interface Event {
    id: number;
    month: string;
    day: string;
    time: string;
    description?: string | null;
    location?: string | null;
    createdAt: string;
    slots: Slot[];
}

export interface CreateEventDTO {
    description: string;
    day: string;
    month: string;
    time: string;
    location: string;
    slots: { function: string }[];
}

export type UpdateEventDTO = Partial<CreateEventDTO>;