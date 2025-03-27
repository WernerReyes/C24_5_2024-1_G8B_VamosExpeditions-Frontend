import type { CityEntity } from "./city.entity";
export interface DistritEntity {
  id: number;
  name: string;
  city?: CityEntity;
}
