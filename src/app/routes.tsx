import { lazy, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProgressSpinner, Toaster } from "@/presentation/components";
import { AuthGuard } from "@/presentation/guards";
import PrivateRoutes from "@/presentation/routes/Private.routes";
import { useAuthStore } from "@/infraestructure/hooks";
import { constantRoutes } from "@/core/constants";
import { useUserAuthenticatedQuery } from "@/infraestructure/store/services";

//* Public pages
const LoginPage = lazy(
  () => import("../presentation/pages/public/login/Login.page")
);

//* Private pages
// const UserRouter = lazy(() => import("./User.router"));
// const AdminRouter = lazy(() => import("./Admin.router"));

const {
  public: { LOGIN },
  private: { DASHBOARD },
} = constantRoutes;

// const { USER, ADMIN } = PrivateRoutes;

export const AppRouter = () => {
  const { authUser, startLogin } = useAuthStore();
  const { data, isLoading, error } = useUserAuthenticatedQuery();
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (data) {
      startLogin(data.data.user);
      setLoadingUser(false);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setLoadingUser(false);
    }
  }, [error]);


  if (isLoading || loadingUser) {
    return (
      <div className="flex h-full max-h-full min-h-screen w-full items-center justify-center">
        <ProgressSpinner />
      </div>
    );
  }

  console.log({ authUser });

  return (
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
  );
};
