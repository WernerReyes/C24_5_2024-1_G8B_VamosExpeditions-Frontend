import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { HotelRoomTripDetailsEntity } from "@/domain/entities";
import type { ApiResponse } from "../response";
import {
  getHotelRoomTripDetailsDto,
  type GetHotelRoomTripDetailsDto,
  type InsertManyHotelRoomTripDetailsDto,
  insertManyHotelRoomTripDetailsDto,
  updateManyHotelRoomTripDetailsByDateDto,
  UpdateManyHotelRoomTripDetailsByDateDto,
} from "@/domain/dtos/hotelRoomTripDetails";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { dateFnsAdapter } from "@/core/adapters";
import { hotelRoomTripDetailsCache } from "./hotelRoomTripDetails.cache";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";
import type { AppState } from "@/app/store";

const PREFIX = "/hotel-room-trip-details";

export const hotelRoomTripDetailsService = createApi({
  reducerPath: "hotelRoomTripDetailsService",
  tagTypes: ["HotelRoomTripDetails", "HotelRoomTripDetail"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getAllHotelRoomTripDetails: builder.query<
      ApiResponse<HotelRoomTripDetailsEntity[]>,
      GetHotelRoomTripDetailsDto
    >({
      query: (params) => {
        const [_, errors] = getHotelRoomTripDetailsDto.create(params);
        if (errors) throw errors;
        return {
          url: "/",
          params,
        };
      },
      providesTags: ["HotelRoomTripDetails"],

      transformResponse: (
        response: ApiResponse<HotelRoomTripDetailsEntity[]>
      ) => {
        return {
          ...response,
          data: response.data.map((hotelRoomTripDetails) => {
            return {
              ...hotelRoomTripDetails,
              date: dateFnsAdapter.parseISO(hotelRoomTripDetails.date),
            };
          }),
        };
      },
    }),

    createManyHotelRoomTripDetails: builder.mutation<
      ApiResponse<HotelRoomTripDetailsEntity[]>,
      InsertManyHotelRoomTripDetailsDto
    >({
      query: (body) => {
        const [_, errors] = insertManyHotelRoomTripDetailsDto.create(body);
        if (errors) throw errors;
        return {
          url: "/many",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          hotelRoomTripDetailsCache.createManyHotelRoomTripDetails(
            data,
            dispatch,
            getState
          );

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
      UpdateManyHotelRoomTripDetailsByDateDto
    >({
      query: (body) => {
        const [_, errors] =
          updateManyHotelRoomTripDetailsByDateDto.create(body);
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
  useGetAllHotelRoomTripDetailsQuery,
  useCreateManyHotelRoomTripDetailsMutation,
  useUpdateManyHotelRoomTripDetailsByDateMutation,
  useDeleteHotelRoomTripDetailsMutation,
  useDeleteManyHotelRoomTripDetailsMutation,
} = hotelRoomTripDetailsService;
