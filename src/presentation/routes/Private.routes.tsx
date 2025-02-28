import { constantRoutes } from "@/core/constants";
import { RoleEnum } from "@/domain/entities";
import { lazy } from "react";
import { Route } from "react-router-dom";
import { NewQuotationGuard, RoleGuard } from "../guards";
import { RouterWithNotFound } from "./RouterWithNotFound";
import { removeBaseRoute } from "@/core/utils";

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

const { BASE } = constantRoutes.private;

const { DASHBOARD, QUOTES, NEW_QUOTE, EDIT_QUOTE, RESERVATIONS } =
  removeBaseRoute(constantRoutes.private, BASE);

const PrivateRoutes = () => {
  return (
    <MainLayout>
      <RouterWithNotFound>
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
          <Route
            path={EDIT_QUOTE + "/:quoteId/:version"}
            element={<NewQuotePage />}
          />

          <Route path={RESERVATIONS} element={<ReservationsPage />} />

          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Route>
      </RouterWithNotFound>
    </MainLayout>
  );
};

export default PrivateRoutes;
