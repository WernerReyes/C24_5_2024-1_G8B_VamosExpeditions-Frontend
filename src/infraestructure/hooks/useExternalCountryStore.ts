import { useDispatch, useSelector } from "react-redux";
import { externalCountryService } from "../services/external/country";
import {
    onSetExternalCountries,
    type AppState
} from "../store";

export const useExternalCountryStore = () => {
  const dispatch = useDispatch();
  const { externalCountries, selectedExternalCountry } = useSelector(
    (state: AppState) => state.externalCountry
  );

  const startGetAllExternalCountries = async () => {
    try {
      const { data } = await externalCountryService.getAll();
      dispatch(onSetExternalCountries(data));
    } catch (error) {
      throw error;
    }
  };

  return {
    //* Atributtes
    externalCountries,
    selectedExternalCountry,

    //* Actions
    startGetAllExternalCountries,
  };
};
