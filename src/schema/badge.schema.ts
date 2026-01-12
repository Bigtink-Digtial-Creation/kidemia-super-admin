import { z } from 'zod';

// const numberString = z
//     .string()
//     .min(1, 'Required')
//     .refine((v) => !isNaN(Number(v)), 'Must be a number');

export const createBadgeSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(10),

    category: z.enum(['achievement', 'milestone', 'special', 'skill']),
    rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),

    points: z.number(),
    icon_url: z.string().url().optional().or(z.literal('')),
    criteria: z.string().optional(),
    color_code: z.string().optional(),
    is_active: z.boolean(),
});

export type CreateBadgeForm = z.input<typeof createBadgeSchema>;
