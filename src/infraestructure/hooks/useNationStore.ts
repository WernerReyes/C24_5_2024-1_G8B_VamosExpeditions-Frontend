import { useDispatch, useSelector } from "react-redux";
import { type AppState, onSetCountries } from "../store";
import { nationService } from "../services/nation";

export const useNationStore = () => {
  const dispatch = useDispatch();

  const { nations } = useSelector((state: AppState) => state.nation);

  const getNations = async () => {
    try {
      const { data } = await nationService.getAllNations();
      dispatch(onSetCountries(data));
    } catch (error) {
      throw error;
    }
  };

  return {
    nations,
    getNations,
  };
};
