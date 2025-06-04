import { PartnerTableFilters_v2 } from "../types";



export const getPartnerTransformedFilters = (filters: any): PartnerTableFilters_v2 => {
  return {
    name: filters["name"]?.constraints?.[0]?.value ?? undefined,
    createdAt: filters["createdAt"]?.constraints?.[0]?.value ?? undefined,
    updatedAt: filters["updatedAt"]?.constraints?.[0]?.value ?? undefined,
    isDeleted: filters["isDeleted"]?.constraints?.[0]?.value ?? undefined,
  };
};
