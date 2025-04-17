import { AppState } from "@/app/store";
import { quotationService } from "@/data";
import { onSetCurrentQuotation } from "@/infraestructure/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { NotFound } from "../components";


export const NewQuotationGuard = () => {
  const dispatch = useDispatch();
  const { currentQuotation } = useSelector(
    (state: AppState) => state.quotation
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    quotationService.getCurrentQuotation().then((quotation) => {
      dispatch(onSetCurrentQuotation(quotation) ?? null);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return null;

  return currentQuotation ? (
    <Outlet />
  ) : (
    <NotFound
      screenSize="partial"
      title="No se encontró una cotización activa"
      message="No se encontró una cotización activa, por favor verifica el enlace o vuelve a la página de cotizaciones."
    />
  );
};

export default NewQuotationGuard;


