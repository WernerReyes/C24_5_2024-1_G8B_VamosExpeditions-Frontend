import type { RoleEntity } from "./role.entity";


export interface UserEntity {
  id: string;
  fullname: string;
  email: string;
  role: RoleEntity
}
