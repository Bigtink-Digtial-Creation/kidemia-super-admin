import { z } from "zod";

export const AddSubjectSchema = z.object({
  name: z
    .string({ message: "Subject Name is required" })
    .min(2, { message: "Subject Name is required" }),
  code: z
    .string({ message: "Subject Code is required" })
    .min(2, { message: "Subject Code is required" }),
  description: z
    .string({ message: "Description is required" })
    .min(2, { message: "Description is required" }),
  color_code: z
    .string({ message: "Color Code is required" })
    .min(2, { message: "Color Code is required" }),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(2, "Subject name is required"),
  code: z.string().min(2, "Subject code is required"),
  description: z.string().optional(),
  color_code: z.string().optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
});

export type AddSubjectSchema = z.infer<typeof AddSubjectSchema>;
export type UpdateSubjectFormData = z.infer<typeof updateSubjectSchema>;
