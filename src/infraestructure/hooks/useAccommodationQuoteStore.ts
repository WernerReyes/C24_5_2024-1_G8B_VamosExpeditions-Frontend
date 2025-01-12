import type { SetAccomodationQuoteDto } from "@/domain/dtos/accommodationQuote";
import { useDispatch, useSelector } from "react-redux";
import { onSetLocalAccommodationQuote } from "../store";
import type { AppState } from "@/app/store";
import { useLazyCountryAndCityQuery } from "../store/services";
import { CityEntity } from "@/domain/entities";

export const useAccommodationQuoteStore = () => {
  const dispatch = useDispatch();

  const [ countryAndCity ] = useLazyCountryAndCityQuery();

  const {
    accommodationQuotes,
    selectedAccommodationQuote,
    localAccommodationQuotes,
  } = useSelector((state: AppState) => state.accommodationQuote);

  const startSetLocalAccommodationQuote = (
    setAccommodationQuoteDto: SetAccomodationQuoteDto
  ) => {
    dispatch(onSetLocalAccommodationQuote(setAccommodationQuoteDto));
  };

  const CountryAndCity = async (data: CityEntity) => {
    await countryAndCity(data)
      .unwrap()
      .then(({ data }) => {
        console.log({ data });
      });
  };

  return {
    //* Atributtes
    accommodationQuotes,
    selectedAccommodationQuote,
    localAccommodationQuotes,

    //* Actions
    startSetLocalAccommodationQuote,
    CountryAndCity,
  };
};
