import { z } from "zod";
import { roleEntitySchema } from "./role.entity";


export const userEntitySchema = z.object({
  id: z.number(),
  fullname: z.string(),
  email: z.string(),
  role: z.object(roleEntitySchema.shape).optional(),
});

export type UserEntity = z.infer<typeof userEntitySchema>;