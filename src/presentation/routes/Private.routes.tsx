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
import { useConnectSocketQuery } from "@/infraestructure/store/services";

const MainLayout = lazy(() => import("../pages/private/layouts/Main.layout"));

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
const Hotelpage = lazy(() => import("../pages/private/Hotels/hotel.page"));
const CountryPage = lazy(() => import("../pages/private/country/country.page"));
const ClientPage = lazy(() => import("../pages/private/clients/Clients.page"));
const PartnerPage = lazy(() => import("../pages/private/partners/Partners.page"));

const NotificationPage = lazy(
  () => import("../pages/private/notification/Notification.page")
);

const UsersPage = lazy(() => import("../pages/private/users/Users.page"));

const { BASE, EDIT_QUOTE, ...rest } = constantRoutes.private;

const {
  DASHBOARD,
  QUOTES,
  NEW_QUOTE,
  RESERVATIONS,
  PROFILE,
  HOTEL,
  COUNTRY,
  NOTIFICATIONS,
  CLIENT,
  PARTNER,
  USERS,
} = removeBaseRoute(rest, BASE);

const PrivateRoutes = () => {
  const { isExpired } = useCookieExpirationStore();
  const { pathname } = useLocation();

  //* Connect to socket
  useConnectSocketQuery(undefined);

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
          <Route path={RESERVATIONS} element={<ReservationsPage />} />
          <Route path={PROFILE} element={<ProfilePage />} />
          <Route path={HOTEL} element={<Hotelpage />} />
          <Route path={COUNTRY} element={<CountryPage />} />
          <Route path={NOTIFICATIONS} element={<NotificationPage />} />
          <Route path={CLIENT} element={<ClientPage />} />
          <Route path={PARTNER} element={<PartnerPage />} />
          //* Guard for users
          <Route
            element={
              <RoleGuard
                roles={[RoleEnum.MANAGER_ROLE]}
                navigateTo={`${BASE}${DASHBOARD}`}
              />
            }
          >
            <Route path={USERS} element={<UsersPage />} />
          </Route>
        </Route>
      </RouterWithNotFound>
    </MainLayout>
  );
};

export default PrivateRoutes;
