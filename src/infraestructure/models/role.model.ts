import { z } from "zod";

export const roleModelSchema = z.object({
  id_role: z.boolean().optional(),
  name: z.boolean().optional(),
});

export type RoleModel = z.infer<typeof roleModelSchema>;

export const roleModel = {
  schema: roleModelSchema,
};
