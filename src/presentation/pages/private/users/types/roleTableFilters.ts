import type { RoleEnum } from "@/domain/entities";

export type RoleTableFilters = Partial<{
  name: RoleEnum[];
  createdAt: Date;
  updatedAt: Date;
}>;
