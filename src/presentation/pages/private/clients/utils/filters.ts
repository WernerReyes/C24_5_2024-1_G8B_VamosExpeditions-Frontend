import { ClientTableFilters } from "../types";


export const getClientTransformedFilters = (filters: any): ClientTableFilters => {
  return {
    fullName: filters["fullName"]?.constraints?.[0]?.value ?? undefined,
    email: filters["email"]?.constraints?.[0]?.value ?? undefined,
    phone: filters["phone"]?.constraints?.[0]?.value ?? undefined,
    subregion: filters["subregion"]?.constraints?.[0]?.value ?? undefined,
    country: filters["country"]?.constraints?.[0]?.value ?? undefined,
    createdAt: filters["createdAt"]?.constraints?.[0]?.value ?? undefined,
    updatedAt: filters["updatedAt"]?.constraints?.[0]?.value ?? undefined,
  };
};
