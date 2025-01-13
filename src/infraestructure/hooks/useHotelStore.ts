import { useDispatch, useSelector } from "react-redux";
import { onSetHotels } from "../store";
import { useLazyGetHotelsQuery } from "../store/services";
import type { GetHotelsDto } from "@/domain/dtos/hotel";
import type { AppState } from "@/app/store";

export const useHotelStore = () => {
  const dispatch = useDispatch();
  const { hotels, selectedHotel } = useSelector(
    (state: AppState) => state.hotel
  );
  const [getHotels, { isLoading: isGettingAllHotels, ...restGetAllHotels }] =
    useLazyGetHotelsQuery();

  const startGetAllHotels = async (getHotelsDto: GetHotelsDto) => {
    await getHotels(getHotelsDto)
      .unwrap()
      .then(({ data }) => {
        dispatch(onSetHotels(data));
      })
      .catch((error) => {
        throw error;
      });
  };

  return {
    //* Atributtes
    hotels,
    selectedHotel,
    getHotelsResult: {
        isGettingAllHotels,
        ...restGetAllHotels,
    },

    //* Functions
    startGetAllHotels,
  };
};
