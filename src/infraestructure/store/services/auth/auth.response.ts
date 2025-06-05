import type { UserEntity } from "@/domain/entities";

export  type DeviceConnection = {
  id: string;
  model?: string;
  version?: string;
  name: string;
  createdAt: Date;
  isOnline: boolean;
}

export type LoginResponse = {
  user: UserEntity;
  expiresAt: string;
};

export type DeviceSocketRes = {
  [userId: string]:  DeviceConnection[];
  
};
