import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import { reservationService } from "@/data";
import {
  onSetCurrentReservation,
  onSetReservations,
  onSetSincronizedCurrentReservationByClient,
} from "../store";
import {
  useCreateReservationMutation,
  useLazyGetAllReservationsQuery,
  useUpdateReservationMutation,
} from "../store/services";
import {
  getReservationsDto,
  GetReservationsDto,
  reservationDto,
  ReservationDto,
} from "@/domain/dtos/reservation";
import { useAlert } from "@/presentation/hooks";
import type { ClientEntity, ReservationEntity } from "@/domain/entities";

export const useReservationStore = () => {
  const dispatch = useDispatch();
  const { currentReservation, reservations } = useSelector(
    (state: AppState) => state.reservation
  );
  const { startShowSuccess, startShowApiError, startShowError } = useAlert();

  const [createReservation, createReservationResult] =
    useCreateReservationMutation();
  const [updateReservation, updateReservationResult] =
    useUpdateReservationMutation();
  const [
    getReservations,
    { isLoading: isGettingAllReservations, ...restGetAllReservations },
  ] = useLazyGetAllReservationsQuery();

  const startCreatingReservation = async (reservationDto: ReservationDto) => {
    await createReservation(reservationDto)
      .unwrap()
      .then(async ({ data, message }) => {
        await reservationService.registerReservation(data);
        dispatch(onSetCurrentReservation(data));
        startShowSuccess(message);
      })
      .catch((error) => {
        startShowApiError(error);
      });
  };

  const startUpdatingReservation = async (
    id: number,
    reservationDto: ReservationDto,
    showMessage = true
  ) => {
    await updateReservation({
      id,
      ...reservationDto,
    })
      .unwrap()
      .then(async ({ data, message }) => {
        await reservationService.registerReservation(data);
        dispatch(onSetCurrentReservation(data));
        if (showMessage) startShowSuccess(message);
      })
      .catch((error) => {
        startShowApiError(error);
      });
  };

  const startUpdatingReservatioTravelDates = async (
    travelDates: [Date, Date]
  ) => {
    if (!currentReservation) return;
    const [reservationDtoValidated, errors] = reservationDto(
      currentReservation.client,
      currentReservation.numberOfPeople,
      travelDates,
      currentReservation.code,
      currentReservation.travelerStyle,
      currentReservation.orderType,
      currentReservation.cities.reduce(
        (acc, city) => ({ ...acc, [city.id]: true }),
        {}
      ),
      currentReservation.specialSpecifications ?? ""
    ).create();
    if (errors) return startShowError(errors[0]);
    await startUpdatingReservation(
      currentReservation.id,
      reservationDtoValidated!,
      false
    );
  };

  const startUpdatingReservationClient = async (client: ClientEntity) => {
    if (!currentReservation) return;
    await reservationService.registerReservation({
      ...currentReservation,
      client,
    });
    console.log({ ...currentReservation, client });
    try {
      dispatch(
        onSetSincronizedCurrentReservationByClient({
          ...currentReservation,
          client,
        })
      );
    } catch (error) {
      console.log({ error });
    }
  };

  const startGettingAllReservations = async ({
    status,
  }: GetReservationsDto) => {
    const [getReservationwDtoValidated, errors] =
      getReservationsDto(status).create();
    if (errors) return startShowError(errors[0]);
    await getReservations(getReservationwDtoValidated!)
      .unwrap()
      .then(({ data }) => {
        dispatch(onSetReservations(data));
      })
      .catch((error) => {
        console.log(error);
        // startShowApiError(error);
      });
  };

  const startChangingCurrentReservation = async (
    reservation: ReservationEntity
  ) => {
    await reservationService.registerReservation(reservation);
    dispatch(onSetCurrentReservation(reservation));
  };

  const startGettingCurrentReservation = async () => {
    try {
      const reservationEntity =
        await reservationService.getCurrentReservation();
      dispatch(onSetCurrentReservation(reservationEntity ?? null));
    } catch (error) {
      throw error;
    }
  };
  const startDeletingReservation = async (id: number) => {
    try {
      await reservationService.deleteReservation(id);
      dispatch(onSetCurrentReservation(null));
    } catch (error) {
      throw error;
    }
  };

  return {
    //* Atributtes
    updateReservationResult,
    createReservationResult,
    getAllReservationsResult: {
      ...restGetAllReservations,
      isGettingAllReservations,
      refetch: (getReservationsDto: GetReservationsDto) =>
        getReservations(getReservationsDto),
    },
    currentReservation,
    reservations,

    //* Functions
    startCreatingReservation,
    startUpdatingReservation,
    startUpdatingReservatioTravelDates,
    startUpdatingReservationClient,
    startGettingAllReservations,
    startChangingCurrentReservation,
    startGettingCurrentReservation,
    startDeletingReservation,
  };
};
