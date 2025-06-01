import type { DistritEntity } from "./distrit.entity";
import type { ServiceTypeEntity } from "./serviceType.entity";

export interface ServiceEntity {
  readonly id: number;
  readonly description: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly duration?: string;
  readonly passengersMin?: number;
  readonly passengersMax?: number;
  readonly priceUsd?: number;
  readonly taxIgvUsd?: number;
  readonly rateUsd?: number;
  readonly pricePen?: number;
  readonly taxIgvPen?: number;
  readonly ratePen?: number;
  readonly district?: DistritEntity;
  readonly serviceType?: ServiceTypeEntity;
}
