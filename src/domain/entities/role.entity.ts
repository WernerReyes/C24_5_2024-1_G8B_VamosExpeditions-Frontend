import { Severity } from "@/presentation/types";

export enum RoleEnum {
  MANAGER_ROLE = "MANAGER_ROLE",
  EMPLOYEE_ROLE = "EMPLOYEE_ROLE",
}
export interface RoleEntity {
  readonly id: string;
  readonly name: RoleEnum;
}

export type RoleRender = {
  label: string;
  value: RoleEnum;
  icon: string;
  severity: Severity;
};

export const roleRender: Record<
  RoleEnum,
  RoleRender
> = {
  [RoleEnum.MANAGER_ROLE]: {
    label: "Manager",
    value: RoleEnum.MANAGER_ROLE,
    icon: "pi pi-user",
    severity: "success",
  },
  [RoleEnum.EMPLOYEE_ROLE]: {
    label: "Employee",
    value: RoleEnum.EMPLOYEE_ROLE,
    icon: "pi pi-user",
    severity: "info",
  },
};
