import { constantRoutes } from "@/core/constants";
import { useCookieExpirationStore } from "@/infraestructure/hooks";
import { useUserAuthenticatedQuery } from "@/infraestructure/store/services";
import {
  ConfirmPopup,
  ExpiredSessionCountdown,
  Toaster,
} from "@/presentation/components";
import { AuthGuard } from "@/presentation/guards";
import PrivateRoutes from "@/presentation/routes/Private.routes";
import { RouterWithNotFound } from "@/presentation/routes/RouterWithNotFound";
import { lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route} from "react-router-dom";

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

  const { isExpired, init } = useCookieExpirationStore();

  useEffect(() => {
    if (userAuthenticatedData) {
      init(userAuthenticatedData.data.expiresAt);
    }
  }, [userAuthenticatedData]);
  
  if (isUserAuthenticatedLoading || isUserAuthenticatedFetching) return null;

  return (
    <>
      {isExpired && <ExpiredSessionCountdown isExpired={isExpired} />}
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        
        <ConfirmPopup />
        <Toaster />
        <RouterWithNotFound>
          {/* <RouterWithNotFound> */}

          <Route
            path="/"
            element={
              <Navigate
                to={userAuthenticatedData?.data?.user.id ? DASHBOARD : LOGIN}
              />
            }
          />
          {/* <Route path={LANDING} element={<LandingPage />} /> */}
          <Route path={LOGIN} element={<LoginPage />} />

          {/* <Route path={MANAGER + "/*"} element={<PrivateRoutes />} /> */}

          <Route element={<AuthGuard privateValidation />}>
          <Route path={BASE} element={<Navigate to={DASHBOARD} />} />
            <Route path={`${BASE}/*`} element={<PrivateRoutes />} />
          </Route>

          {/* {!isLoading && (
          <Route element={<AuthGuard privateValidation />}>
            //* Routes for user
            <Route element={<RoleGuard roles={[RoleEnum.ROLE_USER]} />}>
              <Route path={`${USER}/*`} element={<UserRouter />} />
            </Route>
            //* Routes for admin
            <Route element={<RoleGuard roles={[RoleEnum.ROLE_ADMIN]} />}>
              <Route path={`${ADMIN}/*`} element={<AdminRouter />} />
            </Route>
          </Route>
        )} */}
          {/* </RouterWithNotFound> */}

        
        </RouterWithNotFound>
      </BrowserRouter>
    </>
  );
};
