import { constantRoutes, constantStorage } from "@/core/constants";
import { useCookieExpirationStore } from "@/infraestructure/hooks";
import { useUserAuthenticatedQuery } from "@/infraestructure/store/services";
import { ConfirmPopup, Toaster } from "@/presentation/components";
import { AuthGuard } from "@/presentation/guards";
import PrivateRoutes from "@/presentation/routes/Private.routes";
import { RouterWithNotFound } from "@/presentation/routes/RouterWithNotFound";
import { lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route } from "react-router-dom";
import { useLocation } from "react-use";

//* Public pages
const LoginPage = lazy(
  () => import("../presentation/pages/public/login/Login.page")
);

const ForgetPasswordPage = lazy(
  () =>
    import("../presentation/pages/public/forgetPassword/ForgetPassword.page")
);

const ResetPasswordPage = lazy(
  () => import("../presentation/pages/public/resetPassword/ResetPassword.page")
);

const {
  public: { LOGIN, FORGET_PASSWORD, RESET_PASSWORD },
  private: { BASE: PRIVATE_BASE, DASHBOARD },
} = constantRoutes;

export const AppRouter = () => {
  const { pathname } = useLocation();
  const {
    data: userAuthenticatedData,
    isFetching: isUserAuthenticatedFetching,
    isLoading: isUserAuthenticatedLoading,
  } = useUserAuthenticatedQuery(undefined, {
    skip: skipUserCall(pathname),
  });
  
  const { init } = useCookieExpirationStore();

  useEffect(() => {
    if (userAuthenticatedData) {
      init(userAuthenticatedData.data.expiresAt);
    }
  }, [userAuthenticatedData]);

  if (isUserAuthenticatedLoading || isUserAuthenticatedFetching) return null;

  const lastPath =
    localStorage.getItem(constantStorage.CURRENT_ROUTE) || DASHBOARD;

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ConfirmPopup />
      <Toaster />
      <RouterWithNotFound>
        <Route
          path="/"
          element={
            <Navigate
              to={userAuthenticatedData?.data?.user ? lastPath : LOGIN}
            />
          }
        />
        <Route path={LOGIN} element={<LoginPage />} />
        <Route path={FORGET_PASSWORD} element={<ForgetPasswordPage />} />
        <Route path={RESET_PASSWORD()} element={<ResetPasswordPage />} />
        <Route element={<AuthGuard privateValidation />}>
          <Route path={PRIVATE_BASE}>
            <Route path={"*"} element={<PrivateRoutes />} />
          </Route>
        </Route>
      </RouterWithNotFound>
    </BrowserRouter>
  );
};

const skipUserCall = (
  pathname?: string,
) => {
  return !(
    pathname?.split("/").includes(PRIVATE_BASE.replace("/", "")) ||
    pathname === "/" || 
    pathname === LOGIN
  );
}
