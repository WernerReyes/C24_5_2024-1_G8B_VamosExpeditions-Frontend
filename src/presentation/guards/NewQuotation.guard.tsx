import { AppState } from "@/app/store";
import { constantRoutes } from "@/core/constants";
import { quotationService } from "@/data";
import { onSetCurrentQuotation } from "@/infraestructure/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const { DASHBOARD } = constantRoutes.private;

export const NewQuotationGuard = () => {
  const dispatch = useDispatch();
  const { currentQuotation } = useSelector((state: AppState) => state.quotation);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    quotationService.getCurrentQuotation().then((quotation) => {
      dispatch(onSetCurrentQuotation(quotation) ?? null);
        setIsLoading(false);
    });
  }, []);

  if (isLoading) return null;

  return currentQuotation ? <Outlet /> : <Navigate to={DASHBOARD} />;
};

export default NewQuotationGuard;
