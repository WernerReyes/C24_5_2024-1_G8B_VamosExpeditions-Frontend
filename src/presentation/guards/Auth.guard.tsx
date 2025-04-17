import type { AppState } from "@/app/store";
import { constantRoutes } from "@/core/constants";
import {  useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const {
  public: { LOGIN },
} = constantRoutes;

type Props = {
  privateValidation: boolean;
};

export const AuthGuard = ({ privateValidation }: Props) => {
  const { authUser } = useSelector((state: AppState) => state.auth);

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
