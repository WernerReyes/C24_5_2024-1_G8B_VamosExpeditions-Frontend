import type { UserEntity } from "@/domain/entities";

export type DeviceConnection = {
  id: string;
  model?: string;
  version?: string;
  name: string;
  createdAt: Date;
  isOnline: boolean;
};

export type TwoFactorResponse = {
  qrCodeImageUrl: string;
  email: string;
  userId: number;
};

export type LoginTwoFactorResponse = { require2FA: boolean; tempToken: string };

export type LoginResponse = {
  user: UserEntity;
  expiresAt: string;
  deviceId: string;
};

export type SetTokenFrom2FAEmailResponse = {
  expiresAt: string;
};

export type DeviceSocketRes = {
  [userId: string]: DeviceConnection[];
};
