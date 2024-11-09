export enum UserRoleEnum {
  MANAGER = "manager",
  EMPLOYEE = "employee",
}
export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRoleEnum;
}
