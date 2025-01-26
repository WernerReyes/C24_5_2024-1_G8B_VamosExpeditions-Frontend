import { useDispatch, useSelector } from "react-redux";

import type { AppState } from "@/app/store";
import {
  useCreateQuotationMutation,
  useLazyGetAllQuotationsQuery,
} from "../store/services";
import {
  Day,
  onSetCurrentQuotation,
  onSetCurrentStep,
  onSetQuotations,
  onSetSelectedDay,
} from "../store";
import { LocalQuotationEntity, quotationService } from "@/data";
import { QuotationEntity } from "@/domain/entities";

export const useQuotationStore = () => {
  const dispatch = useDispatch();
  const { currentQuotation, currentStep, quotations, selectedDay } = useSelector(
    (state: AppState) => state.quotation
  );
  const [
    getAllQuotations,
    { isLoading: isGettingAllQuotations, ...getAllQuotationsResult },
  ] = useLazyGetAllQuotationsQuery();
  const [
    createQuotation,
    { isLoading: isCreatingQuotation, ...createQuotationResult },
  ] = useCreateQuotationMutation();

  const startCreateQuotation = async () => {
    await createQuotation()
      .unwrap()
      .then(async ({ data }) => {
        await quotationService.upsertQuotation(data);
        dispatch(onSetCurrentQuotation(data));
      })
      .catch((error) => {
        throw error;
      });
  };

  const startGettingAllQuotations = async () => {
    await getAllQuotations()
      .unwrap()
      .then(({ data }) => {
        dispatch(onSetQuotations(data));
      })
      .catch((error) => {
        throw error;
      });
  };

  const startGettingCurrentQuotation = async () => {
    const quotation = await quotationService.getCurrentQuotation();
    dispatch(onSetCurrentQuotation(quotation) ?? null);
  };

  const startUpdateCurrentQuotation = async (quotation: LocalQuotationEntity) => {
    await quotationService.upsertQuotation(quotation);
    dispatch(onSetCurrentQuotation(quotation));
  };

  const startDeleteCurrentQuotation = async () => {
    await quotationService.deleteCurrentQuotation();
    dispatch(onSetCurrentQuotation(null));
  };

  const startSetCurrentStep = (step: number) => {
    dispatch(onSetCurrentStep(step));
  };

  const startSetSelectedDay = (day: Day | null) => {
    dispatch(onSetSelectedDay(day));
  };

  return {
    //* Atributtes
    currentQuotation,
    currentStep,
    quotations,
    selectedDay,
    createQuotationResult: {
      ...createQuotationResult,
      isCreatingQuotation,
    },
    getAllQuotationsResult: {
      ...getAllQuotationsResult,
      isGettingAllQuotations,
    },

    //* Actions
    startCreateQuotation,
    startUpdateCurrentQuotation,
    startGettingAllQuotations,
    startGettingCurrentQuotation,
    startDeleteCurrentQuotation,
    startSetCurrentStep,
    startSetSelectedDay,
  };
};
