import { z } from 'zod';

const numberString = z
    .string()
    .min(1, 'This field is required')
    .refine(val => !isNaN(Number(val)), {
        message: 'Must be a valid number',
    });


const basePlanFormSchema = z.object({
    plan_name: z.string().min(2),
    description: z.string().nullable().optional(),
    short_description: z.string().nullable().optional(),
    tagline: z.string().nullable().optional(),

    price_monthly: numberString,
    price_quarterly: numberString.nullable().optional(),
    price_yearly: numberString,

    max_members: numberString.nullable().optional(),
    trial_days: numberString.optional(),

    is_active: z.boolean(),
    is_featured: z.boolean(),
    is_popular: z.boolean(),

    show_for_individuals: z.boolean(),
    show_for_guardians: z.boolean(),
    show_for_institutions: z.boolean(),

    benefits_list: z.string().optional(),
    features: z.record(z.string(), z.any()).optional(),
});

export const createPlanSchema = basePlanFormSchema.extend({
    plan_code: z.string().min(2),
    plan_type: z.enum(['custom', 'free', 'student', 'sibling', 'family', 'institution']),
    subscription_type: z.enum(['individual', 'family', 'institution']),
});


export const updatePlanSchema = basePlanFormSchema.partial();


export type CreatePlanData = z.input<typeof createPlanSchema>;
export type UpdatePlanData = z.input<typeof updatePlanSchema>;


export const toNumberOrNull = (value?: string | null) => {
    if (value === undefined || value === null || value === '') return null;
    return Number(value);
};

export const toNumberOrUndefined = (value?: string | null) => {
    if (value === undefined || value === null || value === '') return undefined;
    return Number(value);
};
