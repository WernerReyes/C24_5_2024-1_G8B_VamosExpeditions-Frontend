import { constantRoutes } from "@/core/constants";
import { RoleEnum } from "@/domain/entities";
import { lazy, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RoleGuard } from "../guards";
import { useAuthStore } from "@/infraestructure/hooks";
import { useUserAuthenticatedQuery } from "@/infraestructure/store/services";

const DashboardPage = lazy(
  () => import("../pages/private/dashboard/Dashboard.page")
);
const NewQuotePage = lazy(
  () => import("../pages/private/newQuote/NewQuote.page")
);
const QuotesPage = lazy(() => import("../pages/private/quotes/Quotes.page"));

const { DASHBOARD, QUOTES, NEW_QUOTE } = constantRoutes.private;

const PrivateRoutes = () => {
  // const { startLogin } = useAuthStore();
  

  // const { data, error } = useUserAuthenticatedQuery();

  // useEffect(() => {
  //   if (data) {
  //     startLogin(data.data.user);
  //   }
  // }, [data]);

  // console.log({ dataPrivate: data, error });

  return (
    <Routes>
      <Route path={"/"} element={<Navigate to={DASHBOARD} />} />
      <Route
        element={
          <RoleGuard roles={[RoleEnum.MANAGER_ROLE, RoleEnum.EMPLOYEE_ROLE]} />
        }
      >
        <Route path={DASHBOARD} element={<DashboardPage />} />
        <Route path={QUOTES} element={<QuotesPage />} />
        <Route path={NEW_QUOTE} element={<NewQuotePage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default PrivateRoutes;
