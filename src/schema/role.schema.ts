import { z } from "zod";

export const AddRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Role name must be at least 2 characters")
    .max(50, "Role name must not exceed 50 characters")
    .describe("Unique role name"),

  display_name: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(100, "Display name must not exceed 100 characters")
    .describe("Human-readable role name"),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(255, "Description must not exceed 255 characters")
    .describe("Role description"),

  role_type: z
    .enum(["system", "custom"], {
      message: "Role type must be either 'system' or 'custom'",
    })
    .describe("Type of role (system, custom)"),
  permission_ids: z
    .union([
      z.array(z.uuid("Each permission ID must be a valid UUID")),
      z
        .string()
        .transform((val) =>
          val
            ? val.split(",").filter((id) => z.uuid().safeParse(id).success)
            : [],
        ),
    ])
    .transform((val) => (Array.isArray(val) ? val : []))
    .pipe(z.array(z.uuid("Each permission ID must be a valid UUID")))
    .describe("List of permission IDs to assign"),
});

export type AddRoleSchema = z.infer<typeof AddRoleSchema>;
