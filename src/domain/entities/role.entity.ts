export enum RoleEnum {
  MANAGER_ROLE = "MANAGER_ROLE",
  EMPLOYEE_ROLE = "EMPLOYEE_ROLE",
}
export interface RoleEntity {
  readonly id: string;
  readonly name: RoleEnum;
}
