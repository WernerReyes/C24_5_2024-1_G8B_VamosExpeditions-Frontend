import { Navigate, Outlet } from "react-router-dom";
import { constantRoutes } from "@/core/constants";
import { useAuthStore } from "@/infraestructure/hooks";

const {
  public: { LOGIN },
} = constantRoutes;

type Props = {
  privateValidation: boolean;
};

export const AuthGuard = ({ privateValidation }: Props) => {
  const { authUser } = useAuthStore();
  console.log({ authUser });

  return authUser?.id ? (
    privateValidation ? (
      <Outlet />
    ) : (
      <Navigate replace to={"/"} />
    )
  ) : (
    <Navigate replace to={LOGIN} />
  );
};
