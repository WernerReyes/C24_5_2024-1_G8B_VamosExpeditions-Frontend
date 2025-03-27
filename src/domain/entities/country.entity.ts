import type { CityEntity } from "./city.entity";

export interface CountryEntity {
  readonly id: number;
  readonly name: string;
  readonly code: string;
  readonly image?: {
    readonly png: string;
    readonly svg: string;
  };
  readonly cities?: CityEntity[];
}
