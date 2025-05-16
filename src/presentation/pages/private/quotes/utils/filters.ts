import type { ClientEntity, UserEntity } from "@/domain/entities";
import type { VersionQuotationStatus } from "@/domain/entities/versionQuotation.entity";
import type { QuotesTableFilters } from "../types";

export const filterByStatus = (
  value: VersionQuotationStatus,
  filter: {
    label: string;
    id: VersionQuotationStatus;
  }[]
) => {
  if (Array.isArray(filter) && filter.length === 0) return true;

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

export const getTransformedFilters = (filters: any): QuotesTableFilters => {
  return {
    name: filters["name"].constraints[0].value ?? undefined,
    clientsIds:
      filters["tripDetails.client.id"].constraints[0].value?.map((item: ClientEntity) => item.id) ?? undefined,
    startDate: filters["tripDetails.startDate"].constraints[0].value ?? undefined,
    endDate: filters["tripDetails.endDate"].constraints[0].value ?? undefined,
    representativesIds: filters["user.id"].constraints[0].value?.map((item: UserEntity) => item.id) ?? undefined,
    status: filters["status"].constraints[0].value?.map((item: {
      label: string;
      id: VersionQuotationStatus;
    }) => item.id) ?? undefined,
    createdAt: filters["createdAt"].constraints[0].value ?? undefined,
    updatedAt: filters["updatedAt"].constraints[0].value ?? undefined,
  };
};


