import type { RoleEnum } from "@/domain/entities";
import type { RoleTableFilters } from "../types/roleTableFilters";
import type {UserTableFilters} from "../types/userTableFilters";

export const filterByStatus = (
  value: RoleEnum,
  filter: {
    label: string;
    id: RoleEnum;
  }[]
) => {
  if (Array.isArray(filter) && filter.length === 0) return true;

  return Array.isArray(filter)
    ? filter.some((item) => item?.id === value)
    : false;
};

export const getUserTransformedFilters = (filters: any): UserTableFilters => {
  return {
    createdAt: filters["createdAt"]?.constraints[0].value ?? undefined,
    updatedAt: filters["updatedAt"]?.constraints[0].value ?? undefined,
    email: filters["email"]?.constraints[0].value ?? undefined,
    fullname: filters["fullname"]?.constraints[0].value ?? undefined,
    phoneNumber: filters["phoneNumber"]?.constraints[0].value ?? undefined,
    role:
      filters["role.name"]?.constraints[0].value?.map(
        (role: { id: RoleEnum; label: string }) => role.id
      ) ?? undefined,
  };
};

export const getRoleTransformedFilters = (filters: any): RoleTableFilters => {
  return {
    createdAt: filters["createdAt"]?.constraints[0].value ?? undefined,
    updatedAt: filters["updatedAt"]?.constraints[0].value ?? undefined,
    name: filters["name"]?.constraints[0].value ?? undefined,
  };
};
