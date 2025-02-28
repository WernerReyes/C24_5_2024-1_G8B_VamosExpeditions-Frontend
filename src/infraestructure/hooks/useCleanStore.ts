import { useDispatch } from "react-redux";
import {
  onSetCurrentQuotation,
  onSetCurrentReservation,
  onSetCurrentStep,
  onSetCurrentTripDetails,
  onSetCurrentVersionQuotation,
  onSetHotelRoomTripDetails,
  onSetHotelRoomTripDetailsWithTotalCost,
  onSetSelectedClient,
  onSetSelectedDay,
} from "../store";
import { constantStorage } from "@/core/constants";
import { quotationService } from "@/data";

const { CURRENT_ACTIVE_STEP, ITINERARY_CURRENT_SELECTED_DAY } = constantStorage;

export const useCleanStore = () => {
  const dispatch = useDispatch();

  const cleanChangeEditQuotation = () => {
    dispatch(onSetCurrentQuotation(null));
    dispatch(onSetHotelRoomTripDetailsWithTotalCost([]));
    dispatch(onSetSelectedClient(null));
    dispatch(onSetCurrentTripDetails(null));
    dispatch(onSetCurrentReservation(null));
    dispatch(onSetCurrentVersionQuotation(null));
    dispatch(onSetHotelRoomTripDetails([]));
    dispatch(onSetSelectedDay(null));
  };

  const cleanChangeNewQuotation = () => {
    dispatch(onSetHotelRoomTripDetailsWithTotalCost([]));
    dispatch(onSetSelectedClient(null));
    dispatch(onSetCurrentTripDetails(null));
    dispatch(onSetHotelRoomTripDetails([]));
    dispatch(onSetCurrentReservation(null));
    dispatch(onSetCurrentVersionQuotation(null));
    dispatch(onSetSelectedDay(null));
  }

  const cleanGenerateNewQuotation = async () => {
    cleanChangeEditQuotation();
    dispatch(onSetCurrentStep(0));
    localStorage.removeItem(CURRENT_ACTIVE_STEP);
    localStorage.removeItem(ITINERARY_CURRENT_SELECTED_DAY);
    await quotationService.deleteCurrentQuotation();
  };

  return {
    cleanChangeEditQuotation,
    cleanChangeNewQuotation,
    cleanGenerateNewQuotation,
  };
};
