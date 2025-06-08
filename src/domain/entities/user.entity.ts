import { DeviceConnection } from "@/infraestructure/store/services/auth/auth.response";
import type { RoleEntity } from "./role.entity";
import type { SettingEntity } from './setting.entity';
export interface UserEntity {
  readonly id: number;
  readonly fullname: string;
  readonly email: string;
  readonly online?: boolean;
  readonly role?: RoleEntity;
  readonly phoneNumber?: string;
  readonly description?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  readonly isDeleted?: boolean;
  readonly deletedAt?: Date;
  readonly deleteReason?: string;
  readonly activeDevices?: DeviceConnection[];
  readonly settings?: SettingEntity[];
}
