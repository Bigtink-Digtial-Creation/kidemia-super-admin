import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(2, { message: "Password is required" }),
  remember_me: z.boolean().default(false).optional(),
});

export const ForgotPasswordSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
});

export const ChangePasswordSchema = z.object({
  current_password: z
    .string({ message: "Current Password is required" })
    .min(8, { message: "Current Password is required" }),
  new_password: z
    .string({ message: "New Password is required" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
      {
        message:
          "New Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      }
    ),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
export type ForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>;
export type ChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;


