import type { VersionQuotationStatus } from "@/domain/entities";

export type QuotesTableFilters = {
  name?: string;
  clientsIds?: number[];
  startDate?: Date;
  endDate?: Date;
  representativesIds?: number[];
  status?: VersionQuotationStatus[];
  createdAt?: Date;
  updatedAt?: Date;
};