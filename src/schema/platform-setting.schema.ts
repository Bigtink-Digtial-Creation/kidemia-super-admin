import { z } from 'zod';

export const createSettingSchema = z.object({
    key: z
        .string()
        .min(2)
        .regex(/^[a-z0-9_.]+$/),

    value: z.string().optional(),
    category: z.string().min(1),

    description: z.string().optional(),

    is_secret: z.boolean(),
    is_active: z.boolean(),
});

export type CreateSettingForm = z.input<typeof createSettingSchema>;


export const updateSettingSchema = z.object({
    value: z.string().optional(),
    description: z.string().optional(),
    is_active: z.boolean(),
});

export type UpdateSettingForm = z.input<typeof updateSettingSchema>;
