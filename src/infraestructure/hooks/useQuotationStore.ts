import { useDispatch, useSelector } from "react-redux";
import { onSetDaysNumber, onSetInitialDate, type AppState } from "../store";

export const useQuotationStore = () => {
  const dispatch = useDispatch();
  const { daysNumber, initialDate } = useSelector(
    (state: AppState) => state.quotation
  );

  const startSetDaysNumber = (daysNumber: number) => {
    dispatch(onSetDaysNumber(daysNumber));
  }

    const startSetInitialDate = (initialDate: Date) => {
        dispatch(onSetInitialDate(initialDate));
    }

  return {
    //* Atributtes
    daysNumber,
    initialDate,

    //* Actions
    startSetDaysNumber,
    startSetInitialDate,

  };
};
