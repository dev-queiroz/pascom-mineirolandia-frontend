import { z } from 'zod';

export const eventSchema = z.object({
    day: z
        .string()
        .regex(/^(0[1-9]|[12]\d|3[01])$/, 'Dia deve estar entre 01 e 31'),
    month: z
        .string()
        .regex(/^(0[1-9]|1[0-2])$/, 'Mês deve estar entre 01 e 12'),
    time: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora deve estar no formato HH:mm (00:00 a 23:59)'),
    description: z
        .string()
        .min(3, 'A descrição deve ter pelo menos 3 caracteres')
        .max(500, 'A descrição não pode exceder 500 caracteres')
        .optional(),
    location: z
        .string()
        .max(200, 'O local não pode exceder 200 caracteres')
        .optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;