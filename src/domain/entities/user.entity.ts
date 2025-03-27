
import type { RoleEntity } from "./role.entity";
export interface UserEntity {
  id: number;
  fullname: string;
  email: string;
  online?: boolean;
  role?: RoleEntity;
}
