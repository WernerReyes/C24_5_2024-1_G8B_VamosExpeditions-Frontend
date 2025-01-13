import { useDispatch, useSelector } from "react-redux";
import { type AppState, onSetCountries } from "../store";
import { useLazyGetCountriesQuery } from "../store/services";

export const useCountryStore = () => {
  const dispatch = useDispatch();
  const { countries } = useSelector((state: AppState) => state.country);

  const [getCountries, { isLoading: isGettingCountries, ...restGetCountries }] =
    useLazyGetCountriesQuery();

  const startGettingCountries = async () => {
    await getCountries()
      .unwrap()
      .then(({ data }) => {
        dispatch(onSetCountries(data));
      });
  };

  return {
    //* Atributes
    countries,
    getCountriesResult: {
      isGettingCountries,
      ...restGetCountries,
      refetch: () => getCountries(),
    },

    //* Functions
    startGettingCountries,
  };
};
