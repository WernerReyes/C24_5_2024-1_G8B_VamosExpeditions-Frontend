import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { roleModelSchema } from "./role.model";

export const userModelSchemaPartial = z.object({
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
});

const userModelSchema = userModelSchemaPartial.merge(
  z.object({
    role: z.lazy(() => roleModelSchema).optional(),
  })
);

export type UserModel = z.infer<typeof userModelSchema>;

export const userModel = {
  schema: userModelSchema,
  toString: (user?: UserModel): string | undefined => user ? fromModelToString(user) : undefined,
};
