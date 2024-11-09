import { constantRoutes } from "@/core/constants";
import { UserRoleEnum } from "@/domain/entities";
import { useAuthStore } from "@/infraestructure/hooks";
import { Navigate, Outlet } from "react-router-dom";

const { LOGIN } = constantRoutes.public;

type Props = {
  roles: UserRoleEnum[];
};

export const RoleGuard = ({ roles }: Props) => {
  const { authUser, status } = useAuthStore();
  console.log(authUser, status);
  

  const userSimulated = {
    role: UserRoleEnum.EMPLOYEE,
  };

  return roles.includes(userSimulated.role) ? (
    <Outlet />
  ) : (
    <Navigate to={LOGIN} />
  );
};
