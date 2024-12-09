import type { RoleEntity } from "./role.entity";

export interface UserEntity {
  readonly id: string;
  readonly fullname: string;
  readonly email: string;
  readonly role: RoleEntity
}
