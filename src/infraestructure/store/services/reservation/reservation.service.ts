import {
  getReservationsDto,
  GetReservationsDto,
  getStadisticsDto,
  GetStadisticsDto,
  reservationDto,
  ReservationDto,
} from "@/domain/dtos/reservation";
import { type ReservationEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import { ApiResponse, PaginatedResponse } from "../response";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import type { AppState } from "@/app/store";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";
import type {
  GetReservationsStadistics,
  GetReservationsStats,
} from "./reservation.response";
import { reservationCache } from "./reservation.cache";

const PREFIX = "/reservation";

export const reservationServiceStore = createApi({
  tagTypes: ["Reservations", "Reservation"],
  reducerPath: "reservationServiceStore",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    upsertReservation: builder.mutation<
      ApiResponse<ReservationEntity>,
      ReservationDto
    >({
      query: ({ id, ...body }) => {
        const [_, errors] = reservationDto.create({
          ...body,
          id,
        });
        if (errors) throw errors;
        if (id !== 0) {
          return {
            url: `/${id}`,
            method: "PUT",
            body,
          };
        }
        return {
          url: "/",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);

          reservationCache.upsertReservation(data.data, dispatch, getState);

          versionQuotationCache.updateFromAnotherService(
            {
              ...data.data.versionQuotation,
              reservation: data.data,
            },
            dispatch,
            getState as () => AppState
          );
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),

    getReservationById: builder.query<ApiResponse<ReservationEntity>, number>({
      query: (id) => `/${id}`,
      providesTags: ["Reservation"],
    }),

    getAllReservations: builder.query<
      ApiResponse<PaginatedResponse<ReservationEntity>>,
      GetReservationsDto
    >({
      query: (params) => {
        const [_, errors] = getReservationsDto.create(params);
        if (errors) throw errors;
        return {
          url: "/",
          params,
        };
      },
      providesTags: ["Reservations"],
      transformResponse: (
        response: ApiResponse<PaginatedResponse<ReservationEntity>>
      ) => ({
        ...response,
        data: {
          ...response.data,
          content: response.data.content.map((reservation) => ({
            ...reservation,
            createdAt: new Date(reservation.createdAt),
            updatedAt: new Date(reservation.updatedAt),
          })),
        },
      }),
    }),

    cancelReservation: builder.mutation<
      ApiResponse<ReservationEntity>,
      ReservationEntity["id"]
    >({
      query: (id) => ({
        url: `/${id}/cancel`,
        method: "PUT",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);

          versionQuotationCache.updateFromAnotherService(
            {
              ...data.data.versionQuotation,
              reservation: data.data,
            },
            dispatch,
            getState as () => AppState
          );

          reservationCache.upsertReservation(data.data, dispatch, getState);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),

    getReservationStadistics: builder.query<
      ApiResponse<GetReservationsStadistics>,
      GetStadisticsDto
    >({
      query: (params) => {
        const [_, errors] = getStadisticsDto.create(params);
        if (errors) throw errors;
        
        return {
          url: "/stadistics",
          params,
        };
      },
    }),

    getReservationsStats: builder.query<
      ApiResponse<GetReservationsStats>,
      void
    >({
      query: () => `/stats`,
    }),

    deleteMultipleReservations: builder.mutation<
      ApiResponse<ReservationEntity[]>,
      ReservationEntity["id"][]
    >({
      query: (ids) => ({
        url: "/multiple",
        method: "DELETE",
        body: ids,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);

          reservationCache.deleteMultipleReservations(
            data.data,
            dispatch,
            getState
          );

          // versionQuotationCache.deleteMultipleVersionsFromAnotherService(
          //   data.data.map((reservation) => reservation.versionQuotation),
          //   dispatch,
          //   getState as () => AppState
          // );
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),
  }),
});

export const {
  useGetReservationByIdQuery,
  useGetAllReservationsQuery,
  useUpsertReservationMutation,
  useCancelReservationMutation,
  useGetReservationStadisticsQuery,
  useGetReservationsStatsQuery,
  useDeleteMultipleReservationsMutation,
} = reservationServiceStore;
