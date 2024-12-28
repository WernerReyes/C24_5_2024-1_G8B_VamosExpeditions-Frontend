import type { SetAccomodationQuoteDto } from "@/domain/dtos/accommodationQuote";
import { useDispatch, useSelector } from "react-redux";
import { onSetLocalAccommodationQuote } from "../store";
import type { AppState } from "@/app/store";

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
