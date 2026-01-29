import { z } from 'zod';

export const loginSchema = z.object({
    username: z
        .string()
        .min(3, 'O usuário deve ter pelo menos 3 caracteres')
        .max(50, 'O usuário não pode ter mais de 50 caracteres')
        .trim()
        .regex(/^[a-zA-Z0-9_]+$/, 'O usuário só pode conter letras, números e underline'),
    password: z
        .string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .max(100, 'A senha é muito longa')
        .trim(),
});

export type LoginFormData = z.infer<typeof loginSchema>;