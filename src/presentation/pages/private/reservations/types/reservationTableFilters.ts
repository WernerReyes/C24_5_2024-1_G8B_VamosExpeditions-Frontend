import { ReservationStatus } from "@/domain/entities";

export type ReservationTableFilters = {
  status?: ReservationStatus[];
  createdAt?: Date;
  updatedAt?: Date;
}