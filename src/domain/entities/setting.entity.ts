export enum SettingKeyEnum {
  MAX_ACTIVE_SESSIONS = "MAX_ACTIVE_SESSIONS",
  DATA_CLEANUP_PERIOD = "DATA_CLEANUP_PERIOD",
}

export interface SettingEntity {
  id: number;
  key: SettingKeyEnum;
  value: string | null;
  description: string | null;
  updatedAt: Date | null;
  updatedById: number | null;
}
