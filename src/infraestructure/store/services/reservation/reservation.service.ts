// import type { ApiResponse } from "@/config";
// import { constantEnvs } from "@/core/constants/env.const";
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { ExternalCountryEntity } from "./country.entity";

import { constantEnvs } from "@/core/constants/env.const";
import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "../response";
import {
  ReservationEntity,
  ReservationStatus,
} from "@/domain/entities/reservation.entity";
import { ReservationDto } from "@/domain/dtos/reservation";

const { VITE_API_URL } = constantEnvs;

const PREFIX = "/reservation";

export const reservationService = createApi({
  reducerPath: "reservationService",
  baseQuery: fetchBaseQuery({
    baseUrl: VITE_API_URL + PREFIX,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createReservation: builder.mutation<
      ApiResponse<ReservationEntity>,
      ReservationDto
    >({
      query: (createReservationDto) => ({
        url: "/",
        method: "POST",
        body: createReservationDto,
      }),
    }),

    updateReservation: builder.mutation<
      ApiResponse<ReservationEntity>,
      ReservationDto & { id: number }
    >({
      query: (updateReservationDto) => ({
        url: "/" + updateReservationDto.id,
        method: "PUT",
        body: updateReservationDto,
      }),
    }),

    getReservationById: builder.query<ApiResponse<ReservationEntity>, string>({
      query: (id) => `/${id}`,
    }),
    // updateReservation: builder.mutation<ApiResponse<ReservationEntity>, UpdateReservationDto>({
    // query: (updateReservationDto) => ({
    //     url: "/",
    //     method: "PUT",
    //     body: updateReservationDto,
    // }),
    // }),
    getAllReservationsByStatus: builder.query<
      ApiResponse<ReservationEntity[]>,
      ReservationStatus
    >({
      query: (state) => `/status/${state}`,
    }),

    getAllReservations: builder.query<ApiResponse<ReservationEntity[]>, void>({
      query: () => "/",
    }),
  }),
});

export const {
  useGetReservationByIdQuery,
  // useCreateReservationMutation,
  // useUpdateReservationMutation,
  useGetAllReservationsByStatusQuery,
  useLazyGetAllReservationsByStatusQuery,
  useGetAllReservationsQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation,
} = reservationService;
