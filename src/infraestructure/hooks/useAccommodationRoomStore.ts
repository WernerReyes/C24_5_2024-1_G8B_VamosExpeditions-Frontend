import { useDispatch, useSelector } from "react-redux";
import { accommodationRoomService } from "../services/accommodationRoom";
import { onSetAccommodationRooms, type AppState } from "../store";


export const useAccommodationRoomStore = () => {
  const dispatch = useDispatch();
  const { accommodationRooms, selectedAccommodationRoom } = useSelector(
    (state: AppState) => state.accommodationRoom
  );

  const startGetAllAccommodationRooms = async () => {
    try {
      const { data } = await accommodationRoomService.getAll();
      dispatch(onSetAccommodationRooms(data));
    } catch (error) {
      throw error;
    }
  };

/*   const getCountryAndCity = async (db: CityEntity | null) => {
    try {
      console.log(await accommodationRoomService.countryAndCity(db));
      
    } catch (error) {
      throw error;
    }
  }; */

  return {
    //* Atributtes
    accommodationRooms,
    selectedAccommodationRoom,

    //* Actions
    startGetAllAccommodationRooms,
    /* getCountryAndCity, */
  };
};
