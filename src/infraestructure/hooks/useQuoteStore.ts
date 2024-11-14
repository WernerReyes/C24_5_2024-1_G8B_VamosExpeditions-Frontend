import { useDispatch, useSelector } from "react-redux";
import { quoteService } from "../services";
import { onSetQuotes, type AppState } from "../store";

export const useQuoteStore = () => {
  const dispatch = useDispatch();
  const quote = useSelector((state: AppState) => state.quote);

  const startGetQuotes = async () => {
    try {
      const { data } = await quoteService.getAll();
      dispatch(onSetQuotes(data));
    } catch (error: any) {
      throw error;
    }
  };

  return {
    //* Atributtes
    ...quote,

    //* Functions
    startGetQuotes,
  };
};
