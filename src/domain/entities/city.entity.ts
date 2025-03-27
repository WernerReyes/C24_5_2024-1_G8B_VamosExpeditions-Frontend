import type { CountryEntity } from "./country.entity";

export interface CityEntity {
  readonly id: number;
  readonly name: string;
  readonly country?: CountryEntity;
}
