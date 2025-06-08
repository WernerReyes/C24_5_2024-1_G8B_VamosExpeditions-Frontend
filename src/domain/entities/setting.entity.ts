import { UserEntity } from "./user.entity";

export enum SettingKeyEnum {
  MAX_ACTIVE_SESSIONS = "MAX_ACTIVE_SESSIONS",
  DATA_CLEANUP_PERIOD = "DATA_CLEANUP_PERIOD",
  LAST_CLEANUP_RUN = "LAST_CLEANUP_RUN",
  TWO_FACTOR_AUTH = "TWO_FACTOR_AUTH",
}

export interface SettingEntity {
  id: number;
  key: SettingKeyEnum;
  value: string | null;
  updatedAt: Date | null;
  updatedBy?: UserEntity
}
