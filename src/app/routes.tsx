import { constantRoutes } from "@/core/constants";
import { UserRoleEnum } from "@/domain/entities";
import { useAuthStore } from "@/infraestructure/hooks";
import { Toaster } from "@/presentation/components";
import { AuthGuard } from "@/presentation/guards/Auth.guard";
import PrivateRoutes from "@/presentation/routes/Private.routes";
import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

//* Public pages

const LoginPage = lazy(
  () => import("../presentation/pages/public/login/Login.page")
);

//* Private pages
// const UserRouter = lazy(() => import("./User.router"));
// const AdminRouter = lazy(() => import("./Admin.router"));

const {
  public: { LOGIN },
} = constantRoutes;

// const { USER, ADMIN } = PrivateRoutes;

export const AppRouter = () => {
  const { authUser, status } = useAuthStore();

  console.log(authUser, status);

  //   const { isDark } = useThemeStore();
  //   const { isMobile } = useWindowSize();
  //   const { startRevalidateToken, isLoading, routeRole } = useAuthStore();
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

    const userSimulated = {
      role: UserRoleEnum.MANAGER,
    };

  return (
    <BrowserRouter>
      

      <Toaster  />
      <Routes>
        {/* <RouterWithNotFound> */}
        <Route path="/" element={<Navigate to={LOGIN} />} />
        {/* <Route path={LANDING} element={<LandingPage />} /> */}
        <Route path={LOGIN} element={<LoginPage />} />

        {/* <Route path={MANAGER + "/*"} element={<PrivateRoutes />} /> */}

        <Route element={<AuthGuard privateValidation />}>
          <Route path={userSimulated.role + "/*"} element={<PrivateRoutes />} />
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
