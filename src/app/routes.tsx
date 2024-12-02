import { lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/presentation/components";
import { AuthGuard } from "@/presentation/guards";
import PrivateRoutes from "@/presentation/routes/Private.routes";
import { useAuthStore } from "@/infraestructure/hooks";
import { constantRoutes } from "@/core/constants";

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
  const { authUser } = useAuthStore();

  //   const { isDark } = useThemeStore();
  //   const { isMobile } = useWindowSize();
  //   const { messages, type, startClearMessages } = useMessageStore();

  //   useEffect(() => {
  //     startRevalidateToken();
  //   }, []);

  //   useEffect(() => {
  //     if (!messages.length) return;
  //     showMessage(type, messages);
  //     startClearMessages();
  //   }, [messages]);

  // if (status === AuthStatus.CHECKING) return <h1>Loading...</h1>;

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
