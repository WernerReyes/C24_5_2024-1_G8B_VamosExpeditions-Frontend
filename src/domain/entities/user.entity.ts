import { z } from "zod";
import { roleEntitySchema } from "./role.entity";


export const userEntitySchema = z.object({
  id: z.string(),
  fullname: z.string(),
  email: z.string(),
  role: z.object(roleEntitySchema.shape)
});

export type UserEntity = z.infer<typeof userEntitySchema>;