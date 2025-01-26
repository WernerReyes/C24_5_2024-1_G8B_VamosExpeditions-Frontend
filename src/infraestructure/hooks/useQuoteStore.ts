import { useDispatch, useSelector } from "react-redux";
import { onSetQuotes } from "../store";
import { useLazyGetQuotesQuery } from "../store/services";
import { AppState } from "@/app/store";

export const useQuoteStore = () => {
  const dispatch = useDispatch();
  const { quotes, selectedQuote } = useSelector(
    (state: AppState) => state.quote
  );

  const [getQuotes, { isLoading: isGettingQuotes, ...restGetQuotes }] =
    useLazyGetQuotesQuery();

  const startGetQuotes = async () => {
    await getQuotes()
      .unwrap()
      .then((response) => {
        dispatch(onSetQuotes(response));
      })
      .catch((error) => {
        throw error;
      });
  };

  return {
    //* Atributtes
    quotes,
    selectedQuote,
    getQuotesResult: {
      isGettingQuotes,
      ...restGetQuotes,
      refetch: () => startGetQuotes(),
    },

    //* Functions
    startGetQuotes,
  };
};
