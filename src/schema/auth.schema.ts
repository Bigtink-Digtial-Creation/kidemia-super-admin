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
      },
    ),
});

export const SignUpSchema = z
  .object({
    first_name: z
      .string({ message: "FirstName is required" })
      .min(2, { message: "FirstName is required" }),
    last_name: z
      .string({ message: "LastName is required" })
      .min(2, { message: "LastName is required" }),
    email: z.email({ message: "Enter a valid email address" }),
    password: z
      .string({ message: "Password is required" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
        {
          message:
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        },
      ),
    confirmPassword: z
      .string({ message: "Confirm Password is required" })
      .min(8, { message: "Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

  export const ProfileSchema = z.object({
    email: z.email({ message: "Enter a valid email address" }),
    first_name: z
      .string({ message: "First Name is required" })
      .min(2, { message: "First Name is required" }),
    last_name: z
      .string({ message: "Last Name is required" })
      .min(2, { message: "Last Name is required" }),
    middle_name: z.string({ message: "Middle Name is required" }).optional(),
    phone_number: z.string({ message: "Phone Number is required" }).optional(),
    profile_picture_url: z.string().optional(),
    date_of_birth: z.string({ message: "DoB is required" }).optional(),
    bio: z.string({ message: "Bio is required" }).optional(),
  });

  export type LoginSchema = z.infer<typeof LoginSchema>;
  export type ForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>;
  export type ChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;
  export type SignUpSchema = z.infer<typeof SignUpSchema>;
  export type ProfileSchema = z.infer<typeof ProfileSchema>;

