import type { RoleEnum } from "@/domain/entities";

export type UserTableFilters = Partial<{
  fullname: string;
  email: string;
  role: RoleEnum[];
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}>;
