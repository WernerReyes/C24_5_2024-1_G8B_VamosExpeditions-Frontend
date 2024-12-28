import { useDispatch, useSelector } from "react-redux";
import { quoteService } from "../services";
import { onLoading, onSetError, onSetQuotes, type AppState } from "../store";

export const useQuoteStore = () => {
  const dispatch = useDispatch();
  const { isLoading, quotes, selectedQuote, error } = useSelector(
    (state: AppState) => state.quote
  );

  const startGetQuotes = async () => {
    dispatch(onLoading());
    try {
      const { data } = await quoteService.getAll();
      dispatch(onSetQuotes(data));
      dispatch(onSetError(null));
    } catch (error: any) {
      console.log({ error });
      dispatch(onSetError(error));
      throw error;
    }
  };

  return {
    //* Atributtes
    error,
    isLoading,
    quotes,
    selectedQuote,

    //* Functions
    startGetQuotes,
  };
};
