import { z } from "zod";
import { roleModel } from "./role.model";

const userModelSchema = z.object({
  id_user: z.boolean().optional(),
  fullname: z.boolean().optional(),
  email: z.boolean().optional(),
  password: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  is_deleted: z.boolean().optional(),
  description: z.boolean().optional(),
  phone_number: z.boolean().optional(),
  id_role: z.boolean().optional(),
  deleted_at: z.boolean().optional(),
  delete_reason: z.boolean().optional(),
  role: z
    .object({
      id_role: z.boolean().optional(),
      name: z.boolean().optional(),
    })
    .optional(),
});

export type UserModel = z.infer<typeof userModelSchema>;

export const userModel = {
  schema: userModelSchema,
  toSelect: (user?: UserModel): string | undefined => {
    if (!user) return undefined;
    const { role, ...rest } = user;
    return Object.keys(rest)
      .join(",")
      .concat(roleModel.toSelectPrefix(role));
  },
};
