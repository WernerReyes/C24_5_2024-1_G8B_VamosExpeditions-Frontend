import { constantRoutes } from "@/core/constants";
import { UserRoleEnum } from "@/domain/entities";
import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RoleGuard } from "../guards/Role.guard";

const DashboardPage = lazy(
  () => import("../pages/private/dashboard/Dashboard.page")
);

const QuotesPage = lazy(() => import("../pages/private/quotes/Quotes.page"));

const {
  common: { DASHBOARD, QUOTES },
} = constantRoutes.private;

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route path={"/"} element={<Navigate to={DASHBOARD} />} />
      <Route
        element={
          <RoleGuard roles={[UserRoleEnum.MANAGER, UserRoleEnum.EMPLOYEE]} />
        }
      >
        <Route path={DASHBOARD} element={<DashboardPage />} />
        <Route path={QUOTES} element={<QuotesPage />} />
      </Route>
    </Routes>
  );
};

export default PrivateRoutes;
