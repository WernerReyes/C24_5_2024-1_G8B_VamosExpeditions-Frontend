import type { Subregion } from "@/presentation/types";

export interface ClientEntity {
  readonly id: number;
  readonly fullName: string;
  readonly email: string | null;
  readonly phone: string | null;
  readonly country: {
    readonly name: string;
    readonly image?: {
      readonly png: string;
      readonly svg: string;
    };
  };

  readonly subregion: Subregion;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly isDeleted?: boolean;
  readonly deletedAt?: Date;
  readonly deleteReason?: string;
}
