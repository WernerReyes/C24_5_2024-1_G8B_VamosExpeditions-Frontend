import { constantRoutes } from "@/core/constants";
import {
  useAuthStore,
  useCookieExpirationStore,
  useQuotationStore,
} from "@/infraestructure/hooks";
import {
  ConfirmDialog,
  ConfirmPopup,
  ExpiredSessionCountdown,
  Toaster,
} from "@/presentation/components";
import { AuthGuard } from "@/presentation/guards";
import PrivateRoutes from "@/presentation/routes/Private.routes";
import { lazy, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

//* Public pages
const LoginPage = lazy(
  () => import("../presentation/pages/public/login/Login.page")
);

const {
  public: { LOGIN },
  private: { DASHBOARD },
} = constantRoutes;

export const AppRouter = () => {
  const {
    authUser,
    startVerifyUserAuthenticated,
    userAuthenticatedResult: { isUserAuthenticatedLoading, error },
  } = useAuthStore();
  const { currentQuotation } = useQuotationStore();
  const [loadingUser, setLoadingUser] = useState(true);
  const { isExpired } = useCookieExpirationStore();

  useEffect(() => {
    startVerifyUserAuthenticated().then(() => setLoadingUser(false));
  }, []);

  useEffect(() => {
    if (error) setLoadingUser(false);
  }, [error]);

  if (isUserAuthenticatedLoading || loadingUser) return null;
  

  return (
    <>
      <ConfirmDialog />
      <ConfirmPopup />
      {isExpired && <ExpiredSessionCountdown isExpired={isExpired} />}
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Toaster />
        <Routes>
          {/* <RouterWithNotFound> */}

          <Route
            path="/"
            element={<Navigate to={authUser?.id ? DASHBOARD : LOGIN} />}
          />
          {/* <Route path={LANDING} element={<LandingPage />} /> */}
          <Route path={LOGIN} element={<LoginPage />} />

          {/* <Route path={MANAGER + "/*"} element={<PrivateRoutes />} /> */}

          <Route element={<AuthGuard privateValidation />}>
            <Route path={"/*"} element={<PrivateRoutes />} />
          </Route>

          {/* <PrivateRoutes /> */}

          {/* <Route path={REGISTER} element={<RegisterPage />} /> */}

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

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
