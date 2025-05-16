import type { CountryEntity } from "./country.entity";
import { DistritEntity } from "./distrit.entity";

export interface CityEntity {
  readonly id: number;
  readonly name: string;
  readonly country?: CountryEntity;
  readonly distrits?: DistritEntity[];
}
