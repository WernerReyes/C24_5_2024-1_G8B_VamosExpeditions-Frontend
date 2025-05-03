import type { AppState } from "@/app/store";
import { constantRoutes } from "@/core/constants";
import type { RoleEnum } from "@/domain/entities";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const { LOGIN } = constantRoutes.public;

type Props = {
  roles: RoleEnum[];
  navigateTo?: string;
};

export const RoleGuard = ({ roles, navigateTo=LOGIN }: Props) => {
  const { authUser } = useSelector((state: AppState) => state.auth);
  return authUser && authUser.role && roles.includes(authUser.role.name) ? (
    <Outlet />
  ) : (
    <Navigate to={navigateTo} />
  );
};
