import type { RoleEntity } from "./role.entity";
export interface UserEntity {
  readonly id: number;
  readonly fullname: string;
  readonly email: string;
  readonly online?: boolean;
  readonly role?: RoleEntity;
  readonly phoneNumber?: string;
  readonly description?: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  readonly isDeleted?: boolean;
  readonly deletedAt?: string;
  readonly deletedReason?: string;
  readonly activeDevices?: {
    readonly deviceId: string;
    readonly isOnline: boolean;
  }[]
}
