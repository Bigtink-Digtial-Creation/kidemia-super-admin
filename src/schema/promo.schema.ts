import { z } from 'zod';

const numberString = z
    .string('Required')
    .min(1, 'Required')
    .refine((v) => !isNaN(Number(v)), 'Must be a number');

export const createPromotionSchema = z.object({
    code: z
        .string()
        .min(3, 'Code must be at least 3 characters')
        .regex(/^[A-Z0-9_]+$/, 'Use uppercase letters, numbers, and underscores only'),

    description: z.string().optional(),

    discount_percentage: numberString, // ← string
    start_date: z.string(),
    end_date: z.string(),

    max_uses: numberString.optional(),

    is_active: z.boolean(),
});


export type CreatePromotionForm = z.input<typeof createPromotionSchema>;
