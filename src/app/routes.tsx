import { constantRoutes, constantStorage } from "@/core/constants";
import { useCookieExpirationStore } from "@/infraestructure/hooks";
import { useUserAuthenticatedQuery } from "@/infraestructure/store/services";
import { ConfirmPopup, Toaster } from "@/presentation/components";
import { AuthGuard } from "@/presentation/guards";
import PrivateRoutes from "@/presentation/routes/Private.routes";
import { RouterWithNotFound } from "@/presentation/routes/RouterWithNotFound";
import { lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route } from "react-router-dom";

//* Public pages
const LoginPage = lazy(
  () => import("../presentation/pages/public/login/Login.page")
);

const {
  public: { LOGIN },
  private: { BASE, DASHBOARD },
} = constantRoutes;

export const AppRouter = () => {
  const {
    data: userAuthenticatedData,
    isFetching: isUserAuthenticatedFetching,
    isLoading: isUserAuthenticatedLoading,
  } = useUserAuthenticatedQuery();

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
    <>
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
          <Route element={<AuthGuard privateValidation />}>
            <Route path={BASE} element={<Navigate to={DASHBOARD} />} />
            <Route path={`${BASE}/*`} element={<PrivateRoutes />} />
          </Route>
        </RouterWithNotFound>
      </BrowserRouter>
    </>
  );
};
