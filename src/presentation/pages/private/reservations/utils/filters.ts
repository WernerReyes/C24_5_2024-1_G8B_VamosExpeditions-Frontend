import { ClientEntity, ReservationStatus, UserEntity } from "@/domain/entities";

import type { ReservationTableFilters } from "../types";

export const filterByStatus = (
  value: ReservationStatus,
  filter: {
    label: string;
    id: ReservationStatus;
  }[]
) => {
  if (Array.isArray(filter) && filter.length === 0) return true;

  console.log("filter", filter, value);
  
  return Array.isArray(filter)
    ? filter.some((item) => item?.id === value)
    : false;
};

export const filterByClient = (id: number, filter: ClientEntity[]) => {
  if (Array.isArray(filter) && filter.length === 0) return true;
  return Array.isArray(filter) ? filter.some((item) => item?.id === id) : false;
};

export const filterByRepresentative = (id: number, filter: UserEntity[]) => {
  if (Array.isArray(filter) && filter.length === 0) return true;
  return Array.isArray(filter) ? filter.some((item) => item?.id === id) : false;
};

export const getTransformedFilters = (
  filters: any
): ReservationTableFilters => {
  return {
    createdAt: filters["createdAt"]?.constraints[0].value ?? undefined,
    updatedAt: filters["updatedAt"]?.constraints[0].value ?? undefined,
    status:
      filters["status"]?.constraints[0].value?.map(
        (item: { label: string; id: ReservationStatus }) => item.id
      ) ?? undefined,
  };
};
