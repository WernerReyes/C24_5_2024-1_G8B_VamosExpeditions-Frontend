import { z } from "zod";

export const roleModelSchema = z.object({
  id_role: z.boolean().optional(),
  name: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  is_deleted: z.boolean().optional(),
  deleted_at: z.boolean().optional(),
  delete_reason: z.boolean().optional(),
});

export type RoleModel = z.infer<typeof roleModelSchema>;

export const roleModel = {
  schema: roleModelSchema,
};
