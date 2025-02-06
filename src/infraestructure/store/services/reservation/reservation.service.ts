import { startShowSuccess } from "@/core/utils";
import {
  getReservationsDto,
  GetReservationsDto,
  reservationDto,
  ReservationDto,
} from "@/domain/dtos/reservation";
import { type ReservationEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  onSetCurrentReservation,
  onSetReservations,
} from "../../slices/reservation.slice";
import { requestConfig } from "../config";
import { ApiResponse } from "../response";
import { dateFnsAdapter } from "@/core/adapters";

const PREFIX = "/reservation";

export const reservationServiceStore = createApi({
  tagTypes: ["Reservations", "Reservation"],
  reducerPath: "reservationServiceStore",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    upsertReservation: builder.mutation<
      ApiResponse<ReservationEntity>,
      { reservationDto: ReservationDto; showMessage?: boolean, setCurrentReservation?: boolean }
    >({
      query: ({ reservationDto }) => {
        if (reservationDto.id) {
          return {
            url: `/${reservationDto.id}`,
            method: "PUT",
            body: reservationDto,
          };
        }
        return {
          url: "/",
          method: "POST",
          body: reservationDto,
        };
      },
      invalidatesTags: ["Reservations"],
      async onQueryStarted(
        { reservationDto: dto, showMessage = true, setCurrentReservation = true },
        { dispatch, queryFulfilled }
      ) {
        try {
          //* Validate before sending
          const [_, errors] = reservationDto.create(dto);
          if (errors) throw errors;
          const { data } = await queryFulfilled;
          if (setCurrentReservation) dispatch(onSetCurrentReservation(data.data));
          if (showMessage) startShowSuccess(data.message);
        } catch (error) {
          throw error;
        }
      },
    }),

    getReservationById: builder.query<ApiResponse<ReservationEntity>, number>({
      query: (id) => `/${id}`,
      providesTags: ["Reservation"],
      // async onQueryStarted(args, { dispatch, queryFulfilled }) {
      //   try {
      //     console.log({ args });
      //     //* Validate before sending
      //     if (!args) return;

      //     const { data } = await queryFulfilled;
      //     console.log({ data });
      //     dispatch(onSetCurrentReservation(data.data));
      //     // startShowSuccess(data.message);
      //   } catch (error) {
      //     console.error(error);
      //     throw error;
      //   }
      // },
    }),

    getAllReservations: builder.query<
      ApiResponse<ReservationEntity[]>,
      GetReservationsDto
    >({
      query: (params) => {
        return {
          url: "/",
          params,
        };
      },
      providesTags: ["Reservations"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          //* Validate before sending
          const [_, errors] = getReservationsDto.create(args);
          if (errors) throw errors;

          const { data } = await queryFulfilled;
          dispatch(onSetReservations(data.data));
          // startShowSuccess(data.message);
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      transformResponse: (response: ApiResponse<ReservationEntity[]>) => ({
        ...response,
        data: response.data.map((reservation) => ({
          ...reservation,
          startDate: dateFnsAdapter.parseISO(reservation.startDate as any),
          endDate: dateFnsAdapter.parseISO(reservation.endDate as any),
        })),
      }),
    }),

    
  }),
});

export const {
  useGetReservationByIdQuery,
  useGetAllReservationsQuery,
  useLazyGetAllReservationsQuery,
  useUpsertReservationMutation,
} = reservationServiceStore;
