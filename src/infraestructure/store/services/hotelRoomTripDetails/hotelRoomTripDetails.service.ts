import type { AppState } from "@/app/store";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import type { HotelRoomTripDetailsEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";
import {
  insertManyDetailsTripDetailsDto,
  updateManyDetailsTripDetailsByDateDto,
  type UpdateManyDetailsTripDetailsByDateDto,
  type InsertManyDetailsTripDetailsDto,
} from "@/domain/dtos/common";

const PREFIX = "/hotel-room-trip-details";

export const hotelRoomTripDetailsService = createApi({
  reducerPath: "hotelRoomTripDetailsService",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    createManyHotelRoomTripDetails: builder.mutation<
      ApiResponse<HotelRoomTripDetailsEntity[]>,
      InsertManyDetailsTripDetailsDto
    >({
      query: (body) => {
        const [_, errors] = insertManyDetailsTripDetailsDto.create(body);
        if (errors) throw errors;
        return {
          url: "/many",
          method: "POST",
          body: {
            ...body,
            countPerDay: body.countPerDay < 1 ? 1 : body.countPerDay,
          },
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;

          versionQuotationCache.addMultipleHotelRoomTripDetails(
            data.data,
            dispatch,
            getState as () => AppState
          );

          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),

    updateManyHotelRoomTripDetailsByDate: builder.mutation<
      ApiResponse<HotelRoomTripDetailsEntity[]>,
      UpdateManyDetailsTripDetailsByDateDto
    >({
      query: (body) => {
        const [_, errors] = updateManyDetailsTripDetailsByDateDto.create(body);
        if (errors) throw errors;
        return {
          url: "/many/date",
          method: "PUT",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          versionQuotationCache.updateManyHotelRoomTripDetailsByDate(
            data.data,
            dispatch,
            getState as () => AppState
          );
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),

    deleteHotelRoomTripDetails: builder.mutation<
      ApiResponse<HotelRoomTripDetailsEntity>,
      HotelRoomTripDetailsEntity["id"]
    >({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          versionQuotationCache.deleteHotelRoomTripDetails(
            data.data,
            dispatch,
            getState as () => AppState
          );
        } catch (error: any) {
          startShowApiError(error.error);
          throw error;
        }
      },
    }),

    deleteManyHotelRoomTripDetails: builder.mutation<
      ApiResponse<HotelRoomTripDetailsEntity[]>,
      HotelRoomTripDetailsEntity["id"][]
    >({
      query: (ids) => {
        if (!ids.length) {
          throw "No ids provided";
        }
        return {
          url: "/many/date",
          method: "DELETE",
          body: {
            ids,
          },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          versionQuotationCache.deleteManyHotelRoomTripDetails(
            data.data,
            dispatch,
            getState as () => AppState
          );
        } catch (error: any) {
          startShowApiError(error.error);
          throw error;
        }
      },
    }),
  }),
});

export const {
  useCreateManyHotelRoomTripDetailsMutation,
  useUpdateManyHotelRoomTripDetailsByDateMutation,
  useDeleteHotelRoomTripDetailsMutation,
  useDeleteManyHotelRoomTripDetailsMutation,
} = hotelRoomTripDetailsService;
