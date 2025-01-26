import { z } from "zod";

export enum RoleEnum {
  MANAGER_ROLE = "MANAGER_ROLE",
  EMPLOYEE_ROLE = "EMPLOYEE_ROLE",
}

export const roleEntitySchema = z.object({
  id: z.string(),
  name: z.nativeEnum(RoleEnum),
});

export type RoleEntity = z.infer<typeof roleEntitySchema>;
