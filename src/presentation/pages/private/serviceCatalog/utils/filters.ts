import { ServiceTableFilters } from "../types/serviceTableFilters";

export const getServiceTransformedFilters = (filters: any):ServiceTableFilters  => {
    return {
        description: filters["description"]?.constraints[0].value ?? undefined,
    };
}