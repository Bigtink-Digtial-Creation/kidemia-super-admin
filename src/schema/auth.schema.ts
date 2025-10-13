import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(2, { message: "Password is required" }),
  remember_me: z.boolean().default(false).optional(),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
