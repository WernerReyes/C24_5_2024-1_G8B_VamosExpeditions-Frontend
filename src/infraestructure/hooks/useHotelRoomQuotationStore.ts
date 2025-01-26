import type { AppState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateHotelRoomQuotationMutation,
  useDeleteHotelRoomQuotationMutation,
} from "../store/services";
import {
  onAddHotelRoomQuotation,
  onDeleteHotelRoomQuotation,
  onSetHotelRoomQuotations,
} from "../store";
import {
  type HotelRoomQuotationDto,
  hotelRoomQuotationDto,
} from "@/domain/dtos/hotelRoomQuotation";
import { useAlert } from "@/presentation/hooks";
import { hotelRoomQuotationService } from "@/data";

export const useHotelRoomQuotationStore = () => {
  const dispatch = useDispatch();
  const { hotelRoomQuotations } = useSelector(
    (state: AppState) => state.hotelRoomQuotation
  );

  const { startShowSuccess, startShowApiError } = useAlert();

  const [
    createHotelRoomQuotation,
    {
      isLoading: isCreatingHotelRoomQuotation,
      ...createHotelRoomQuotationResult
    },
  ] = useCreateHotelRoomQuotationMutation();
  const [
    deleteHotelRoomQuotation,
    {
      isLoading: isDeletingHotelRoomQuotation,
      ...deleteHotelRoomQuotationResult
    },
  ] = useDeleteHotelRoomQuotationMutation();

  const startCreateHotelRoomQuotation = async (dto: HotelRoomQuotationDto) => {
    const [hotelRoomQuotationDtoValidated, errors] = hotelRoomQuotationDto(
      dto.hotelRoomId,
      dto.versionQuotationId,
      dto.day,
      dto.numberOfPeople
    ).create();
    if (errors) return console.error(errors[0]);

    await createHotelRoomQuotation(hotelRoomQuotationDtoValidated!)
      .unwrap()
      .then(async ({ data, message }) => {
        await hotelRoomQuotationService.upsertHotelRoomQuotation(data);
        dispatch(onAddHotelRoomQuotation(data));
        startShowSuccess(message);
      })
      .catch((error) => {
        startShowApiError(error);
        throw error;
      });
  };

  const startDeleteHotelRoomQuotation = async (id: number) => {
    await deleteHotelRoomQuotation(id)
      .unwrap()
      .then(async () => {
        await hotelRoomQuotationService.deleteCurrentHotelRoomQuotation(id);
        dispatch(onDeleteHotelRoomQuotation(id));
      })
      .catch((error) => {
        startShowApiError(error);
        throw error;
      });

    // dispatch(onAddHotelRoomQuotation(undefined));
  };

  const startGetHotelRoomsQuotation = async () => {
    const hotelRoomsQuotation =
      await hotelRoomQuotationService.getCurrentHotelRoomsQuotation();
    dispatch(onSetHotelRoomQuotations(hotelRoomsQuotation));
  };

  return {
    //* Atributtes
    hotelRoomQuotations,
    createHotelRoomQuotationResult: {
      ...createHotelRoomQuotationResult,
      isCreatingHotelRoomQuotation,
    },
    deleteHotelRoomQuotationResult: {
      ...deleteHotelRoomQuotationResult,
      isDeletingHotelRoomQuotation,
    },

    //* Actions
    startCreateHotelRoomQuotation,
    startDeleteHotelRoomQuotation,
    startGetHotelRoomsQuotation,
  };
};
