import { AppState } from "@/app/store";
import { constantRoutes } from "@/core/constants";
import { quotationService } from "@/data";
import {
  onSetCurrentQuotation,
  onSetCurrentStep,
} from "@/infraestructure/store";
import { useCreateQuotationMutation } from "@/infraestructure/store/services";
import { Button, confirmDialog } from "@/presentation/components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { NEW_QUOTE } = constantRoutes.private;

export const NewQuotationButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentQuotation } = useSelector(
    (state: AppState) => state.quotation
  );
  const [createQuotation] =
    useCreateQuotationMutation();

  const handleNewQuote = async () => {
    if (currentQuotation) {
      const confirm = await confirmReplaceQuotation();
      if (confirm) {
        await quotationService.deleteCurrentQuotation();
        dispatch(onSetCurrentQuotation(null));
        dispatch(onSetCurrentStep(0));
        await createQuotation();
      }
    } else {
      await createQuotation();
    }
    navigate(NEW_QUOTE);
  };

  return (
    <Button
      label="Nueva cotización"
      icon="pi pi-plus-circle"
      onClick={() => handleNewQuote()}
    />
  );
};

export const confirmReplaceQuotation = () => {
  return new Promise<boolean>((resolve) => {
    confirmDialog({
      message: "Tienes una cotización en proceso, ¿deseas reemplazarla?",
      header: "Nueva cotización",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí",
      accept: function () {
        resolve(true);
      },
      reject: function () {
        resolve(false);
      },
    });
  });
};
