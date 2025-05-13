import { z } from "zod";

const roleModelSchema = z.object({
  id_role: z.boolean().optional(),
  name: z.boolean().optional(),
});

export type RoleModel = z.infer<typeof roleModelSchema>;

export const roleModel = {
  schema: roleModelSchema,
  toSelectPrefix: (data?: RoleModel): string => {
    return data
      ? ","+Object.keys(data)
          .map((value) => `role.${value}`)
          .join(",")
      : "";
  },
};
