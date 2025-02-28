import { ClientEntity, UserEntity } from "@/domain/entities";
import { VersionQuotationStatus } from "@/domain/entities/versionQuotation.entity";

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
  return Array.isArray(filter)
    ? filter.some((item) => item?.id === id)
    : false;
};
