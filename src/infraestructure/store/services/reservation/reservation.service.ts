import {
  archiveReservationDto,
  type ArchiveReservationDto,
  getReservationsDto,
  type GetReservationsDto,
  getStadisticsDto,
  type GetStadisticsDto,
  reservationDto,
  type ReservationDto,
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
import { dateFnsAdapter } from "@/core/adapters";

const PREFIX = "/reservation";

export const reservationServiceStore = createApi({
  tagTypes: ["Reservations", "Reservation", "ArchivedReservations"],
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
            createdAt: dateFnsAdapter.parseISO(reservation.createdAt),
            updatedAt: dateFnsAdapter.parseISO(reservation.updatedAt),
          })),
        },
      }),
    }),

    getArchivedReservations: builder.query<
      ApiResponse<PaginatedResponse<ReservationEntity>>,
      GetReservationsDto
    >({
      query: (params) => {
        const [_, errors] = getReservationsDto.create(params);
        if (errors) throw errors;
        return {
          url: "/archive",
          params: {
            ...params,
            isDeleted: true,
          },
        };
      },
      providesTags: ["ArchivedReservations"],
      transformResponse: (
        response: ApiResponse<PaginatedResponse<ReservationEntity>>
      ) => ({
        ...response,
        data: {
          ...response.data,
          content: response.data.content.map((reservation) => ({
            ...reservation,
            createdAt: dateFnsAdapter.parseISO(reservation.createdAt),
            updatedAt: dateFnsAdapter.parseISO(reservation.updatedAt),
          })),
        },
      }),
    }),

    archiveReservation: builder.mutation<
      ApiResponse<ReservationEntity>,
      ArchiveReservationDto
    >({
      query: ({ id, ...body }) => {
        const [_, errors] = archiveReservationDto.create({
          ...body,
          id,
        });
        if (errors) throw errors;
        return {
          url: `/archive`,
          method: "PUT",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled, }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);

          // reservationCache.upsertReservation(data.data, dispatch, getState);

          // versionQuotationCache.updateFromAnotherService(
          //   {
          //     ...data.data.versionQuotation,
          //     reservation: data.data,
          //   },
          //   dispatch,
          //   getState as () => AppState
          // );
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
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
  useGetArchivedReservationsQuery,
  useArchiveReservationMutation,
  useUpsertReservationMutation,
  useCancelReservationMutation,
  useGetReservationStadisticsQuery,
  useGetReservationsStatsQuery,
  useDeleteMultipleReservationsMutation,
} = reservationServiceStore;
