import type { RenderStatus } from "@/presentation/types";

export enum RoleEnum {
  MANAGER_ROLE = "MANAGER_ROLE",
  EMPLOYEE_ROLE = "EMPLOYEE_ROLE",
}
export interface RoleEntity {
  readonly id: string;
  readonly name: RoleEnum;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly isDeleted: boolean;
  readonly deletedAt: Date | null;
  readonly deleteReason: string | null;
}

export const roleRender: Record<RoleEnum, RenderStatus<RoleEnum>> = {
  [RoleEnum.MANAGER_ROLE]: {
    label: "Gerente",
    value: RoleEnum.MANAGER_ROLE,
    icon: "pi pi-user",
    severity: "success",
  },
  [RoleEnum.EMPLOYEE_ROLE]: {
    label: "Empleado",
    value: RoleEnum.EMPLOYEE_ROLE,
    icon: "pi pi-user",
    severity: "info",
  },
};
