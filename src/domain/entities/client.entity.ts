import type { Subregion } from "@/presentation/types";

export interface ClientEntity {
  readonly id: number;
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly country: {
    readonly name: string;
    readonly image?: {
      readonly png: string;
      readonly svg: string;
    };
  };
  readonly subregion: Subregion;
  readonly cretedAt: string;
  readonly updatedAt: string;
}
