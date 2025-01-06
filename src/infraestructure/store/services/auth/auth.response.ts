import type { UserEntity } from "@/domain/entities";

export type LoginResponse = {
  user: UserEntity;
  expiresAt: string;
};
