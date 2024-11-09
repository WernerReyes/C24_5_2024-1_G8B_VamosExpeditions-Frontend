import { Navigate, Outlet } from "react-router-dom";


import { constantRoutes } from "@/core/constants";
import { useAuthStore } from "@/infraestructure/hooks";
import { UserRoleEnum } from "@/domain/entities";


const { public: { LOGIN } } = constantRoutes

type Props = {
  privateValidation: boolean;
};

export const AuthGuard = ({ privateValidation }: Props) => {
  const { authUser } = useAuthStore();

  console.log(authUser?.role, "HOLA MUBD");

  const userSimulated = {
    id: 1,
    role: UserRoleEnum.MANAGER
  };

  return userSimulated.id ? (
    privateValidation ? (
      <Outlet />
    ) : (
      <Navigate replace to={"/" + userSimulated.role} />
    )
  ) : (
    <Navigate replace to={LOGIN} />
  );
};

