import { constantRoutes, constantStorage } from "@/core/constants";
import { RoleEnum } from "@/domain/entities";
import { lazy, useEffect } from "react";
import { Route } from "react-router-dom";
import { NewQuotationGuard, RoleGuard } from "../guards";
import { RouterWithNotFound } from "./RouterWithNotFound";
import { removeBaseRoute } from "@/core/utils";
import { ExpiredSessionCountdown } from "../components";
import { useCookieExpirationStore } from "../../infraestructure/hooks/useCookieExpirationStore";
import { useLocation } from "react-use";
import {
  useConnectSocketQuery,
  useGetUsersQuery,
} from "@/infraestructure/store/services";
import { MainLayout } from "../pages/private/layouts";

// const MainLayout = lazy(() => import("../pages/private/layouts/Main.layout"));

const DashboardPage = lazy(
  () => import("../pages/private/dashboard/Dashboard.page")
);
const NewQuotePage = lazy(
  () => import("../pages/private/newQuote/NewQuote.page")
);
const QuotesPage = lazy(() => import("../pages/private/quotes/Quotes.page"));

const ReservationsPage = lazy(
  () => import("../pages/private/reservations/Reservations.page")
);

const ProfilePage = lazy(() => import("../pages/private/profile/Profile.page"));

const { BASE, VIEW_QUOTE, EDIT_QUOTE, ...rest } = constantRoutes.private;

const { DASHBOARD, QUOTES, NEW_QUOTE, RESERVATIONS, PROFILE } = removeBaseRoute(
  rest,
  BASE
);

const PrivateRoutes = () => {
  const { isExpired } = useCookieExpirationStore();
  const { pathname } = useLocation();

  //* Connect to socket
  useConnectSocketQuery();

  //* Get Users
  useGetUsersQuery();
  

  useEffect(() => {
    if (!pathname) return;
    localStorage.setItem(constantStorage.CURRENT_ROUTE, pathname);
  }, [pathname]);

  return (
    <MainLayout>
      {isExpired && <ExpiredSessionCountdown isExpired={isExpired} />}
      <RouterWithNotFound type="private">
        <Route
          element={
            <RoleGuard
              roles={[RoleEnum.MANAGER_ROLE, RoleEnum.EMPLOYEE_ROLE]}
            />
          }
        >
          <Route path={DASHBOARD} element={<DashboardPage />} />
          <Route path={QUOTES} element={<QuotesPage />} />

          <Route element={<NewQuotationGuard />}>
            <Route path={NEW_QUOTE} element={<NewQuotePage />} />
          </Route>
          <Route path={EDIT_QUOTE()} element={<NewQuotePage />} />
          <Route path={VIEW_QUOTE()} element={<NewQuotePage />} />
          <Route path={RESERVATIONS} element={<ReservationsPage />} />

          <Route path={PROFILE} element={<ProfilePage />} />

          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Route>
      </RouterWithNotFound>
    </MainLayout>
  );
};

export default PrivateRoutes;
