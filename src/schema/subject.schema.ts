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

export type AddSubjectSchema = z.infer<typeof AddSubjectSchema>;
