import { HotelsTableFilters } from "../../quotes/types";

export const getTransformedFilters2 = (filters: any): HotelsTableFilters => {
  return {
    name: filters["name"]?.constraints?.[0]?.value ?? undefined,
    distrit: filters["distrit.name"]?.constraints?.[0]?.value ?? undefined,
    category: filters["category"]?.constraints?.[0]?.value ?? undefined,
  };
};
