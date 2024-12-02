import { constantRoutes } from "@/core/constants";
import { RoleEnum } from "@/domain/entities";
import { useAuthStore } from "@/infraestructure/hooks";
import { Navigate, Outlet } from "react-router-dom";

const { LOGIN } = constantRoutes.public;

type Props = {
  roles: RoleEnum[];
};

export const RoleGuard = ({ roles }: Props) => {
  const { authUser } = useAuthStore();
  return authUser?.id && roles.includes(authUser.role.name) ? (
    <Outlet />
  ) : (
    <Navigate to={LOGIN} />
  );
};
