import type { SetAccomodationQuoteDto } from "@/domain/dtos/accommodationQuote";
import { useDispatch, useSelector } from "react-redux";
import { onSetLocalAccommodationQuote, type AppState } from "../store";

export const useAccommodationQuoteStore = () => {
  const dispatch = useDispatch();
  const { accommodationQuotes, selectedAccommodationQuote, localAccommodationQuotes } = useSelector(
    (state: AppState) => state.accommodationQuote
  );

  const startSetLocalAccommodationQuote = (setAccommodationQuoteDto: SetAccomodationQuoteDto) => {
    dispatch(onSetLocalAccommodationQuote(setAccommodationQuoteDto));
  };

  return {
    //* Atributtes
    accommodationQuotes,
    selectedAccommodationQuote,
    localAccommodationQuotes,

    //* Actions
    startSetLocalAccommodationQuote,
  };
};
