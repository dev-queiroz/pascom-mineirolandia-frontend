import { z } from 'zod';

export const contributionSchema = z.object({
    value: z.preprocess(
        (val) => (typeof val === 'string' ? Number(val.replace(',', '.')) : val),
        z.number()
            .positive('O valor deve ser maior que zero')
            .max(100000, 'O valor está muito alto (máximo R$ 100.000)')
    ),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
        .refine((val) => {
            const date = new Date(val);
            return !isNaN(date.getTime()) && date <= new Date();
        }, 'Data inválida ou futura'),
    time: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Hora deve estar no formato HH:mm')
        .optional(),
    note: z
        .string()
        .max(500, 'A observação não pode exceder 500 caracteres')
        .optional(),
    comprovante: z
        .instanceof(File)
        .refine((file) => file.size > 0, 'O comprovante é obrigatório')
        .refine((file) => file.size <= 5 * 1024 * 1024, 'O arquivo deve ter menos de 5MB')
        .refine(
            (file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type),
            'Apenas JPG, PNG ou PDF são permitidos'
        ),
});

export type ContributionFormData = z.infer<typeof contributionSchema>;