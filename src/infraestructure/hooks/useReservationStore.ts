import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import { reservationService } from "@/data";
import {
  onSetCurrentReservation,
  onSetReservations,
  onSetSincronizedCurrentReservationByClient,
} from "../store";
import {
  useGetAllReservationsQuery,
  useLazyGetAllReservationsQuery,
  useUpsertReservationMutation,
} from "../store/services";
import {
  getReservationsDto,
  GetReservationsDto,
  reservationDto,
  ReservationDto,
} from "@/domain/dtos/reservation";
import { useAlert } from "@/presentation/hooks";
import type { ClientEntity, ReservationEntity } from "@/domain/entities";
import { useState } from "react";

export const useReservationStore = () => {
  const dispatch = useDispatch();
  const { currentReservation, reservations } = useSelector(
    (state: AppState) => state.reservation
  );
  const { startShowSuccess, startShowApiError, startShowError } = useAlert();

  const [
    upsertReservation,
    { isLoading: isUpsertingReservation, ...upsertReservationResult },
  ] = useUpsertReservationMutation();

  const [
    getReservations,
    { isLoading: isGettingAllReservations, ...restGetAllReservations },
  ] = useLazyGetAllReservationsQuery();

  const startUpsertingReservation = async (
    reservationDto: ReservationDto,
    showMessage = true
  ) => {
    await upsertReservation(reservationDto)
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
    const [reservationDtoValidated, errors] = reservationDto({
      ...currentReservation,
      travelDates,
      destination: currentReservation.cities?.reduce(
        (acc, city) => ({ ...acc, [city.id]: true }),
        {}
      )!,
      client: currentReservation.client!,
      specialSpecifications: currentReservation.specialSpecifications ?? "",
    }).create();
    if (errors) return startShowError(errors[0]);
    await startUpsertingReservation(reservationDtoValidated!, false);
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

  const startGettingAllReservations = async (dto: GetReservationsDto) => {
    const [getReservationwDtoValidated, errors] =
      getReservationsDto(dto).create();
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
    upsertReservationResult: {
      ...upsertReservationResult,
      isUpsertingReservation,
    },

    getAllReservationsResult: {
      ...restGetAllReservations,
      isGettingAllReservations,
      refetch: (getReservationsDto: GetReservationsDto) =>
        startGettingAllReservations(getReservationsDto),
    },
    currentReservation,
    reservations,

    //* Functions
    startUpsertingReservation,
    startUpdatingReservatioTravelDates,
    startUpdatingReservationClient,
    startGettingAllReservations,
    startChangingCurrentReservation,
    startGettingCurrentReservation,
    startDeletingReservation,
  };
};
