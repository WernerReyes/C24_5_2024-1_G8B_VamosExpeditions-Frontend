import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { HotelRoomTripDetailsEntity } from "@/domain/entities";
import type { ApiResponse } from "../response";
import {
  getHotelRoomTripDetailsDto,
  type GetHotelRoomTripDetailsDto,
  hotelRoomTripDetailsDto,
  type HotelRoomTripDetailsDto,
  type InsertManyHotelRoomTripDetailsDto,
  insertManyHotelRoomTripDetailsDto,
  updateManyHotelRoomTripDetailsByDateDto,
  UpdateManyHotelRoomTripDetailsByDateDto,
} from "@/domain/dtos/hotelRoomTripDetails";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { dateFnsAdapter } from "@/core/adapters";
import { onSetHotelRoomTripDetails } from "../../slices/hotelRoomTripDetails.slice";
import { onSetCurrentVersionQuotation } from "../../slices/versionQuotation.slice";

const PREFIX = "/hotel-room-trip-details";

export const hotelRoomTripDetailsService = createApi({
  reducerPath: "HotelRoomTripDetailsService",
  tagTypes: ["HotelRoomTripDetails", "HotelRoomTripDetail"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getAllHotelRoomTripDetails: builder.query<
      ApiResponse<HotelRoomTripDetailsEntity[]>,
      GetHotelRoomTripDetailsDto
    >({
      query: (params) => {
        return {
          url: "/",
          params,
        };
      },
      providesTags: ["HotelRoomTripDetails"],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        const [_, errors] = getHotelRoomTripDetailsDto.create(params);
        if (errors) throw errors;
        try {
          const { data } = await queryFulfilled;
          dispatch(onSetHotelRoomTripDetails(data.data));
        } catch (error) {
          throw error;
        }
      },
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
    createHotelRoomTripDetails: builder.mutation<
      ApiResponse<HotelRoomTripDetailsEntity>,
      HotelRoomTripDetailsDto
    >({
      query: (hotelRoomTripDetailsDto) => ({
        url: "/",
        method: "POST",
        body: hotelRoomTripDetailsDto,
      }),
      invalidatesTags: ["HotelRoomTripDetails"],

      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const [_, errors] = hotelRoomTripDetailsDto.create(body);
        if (errors) throw errors;
        try {
          const { data } = await queryFulfilled;
          dispatch(updateHotelRoomTripDetailsCache(data.data));
          startShowSuccess(data.message);
        } catch (error: any) {
          startShowApiError(error.error);
          throw error;
        }
      },
    }),
    createManyHotelRoomTripDetails: builder.mutation<
      ApiResponse<HotelRoomTripDetailsEntity[]>,
      InsertManyHotelRoomTripDetailsDto
    >({
      query: (hotelRoomTripDetailsDto) => ({
        url: "/many",
        method: "POST",
        body: hotelRoomTripDetailsDto,
      }),
      invalidatesTags: ["HotelRoomTripDetails"],

      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const [_, errors] = insertManyHotelRoomTripDetailsDto.create(body);
        if (errors) throw errors;
        try {
          const { data } = await queryFulfilled;
          data.data.forEach((hotelRoomTripDetails) => {
            dispatch(updateHotelRoomTripDetailsCache(hotelRoomTripDetails));
            if (hotelRoomTripDetails.tripDetails) {
              dispatch(
                onSetCurrentVersionQuotation(
                  hotelRoomTripDetails.tripDetails?.versionQuotation ?? null
                )
              );
            }
          });
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
      query: (params) => ({
        url: "/many/date",
        method: "PUT",
        body: params,
      }),
      invalidatesTags: ["HotelRoomTripDetails"],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const [_, errors] =
            updateManyHotelRoomTripDetailsByDateDto.create(body);
          if (errors) throw errors;
          const { data } = await queryFulfilled;
          data.data.forEach((hotelRoomTripDetails) => {
            dispatch(updateHotelRoomTripDetailsCache(hotelRoomTripDetails));
          });
          // startShowSuccess(data.message);
        } catch (error: any) {
          startShowApiError(error.error);
          throw error;
        }
      },
    }),

    deleteHotelRoomTripDetails: builder.mutation<
      ApiResponse<HotelRoomTripDetailsEntity>,
      number
    >({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HotelRoomTripDetails"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(deleteHotelRoomTripDetailsCache(data.data));
          // startShowSuccess(data.message);
          if (data.data.tripDetails) {
            dispatch(
              onSetCurrentVersionQuotation(
                data.data.tripDetails?.versionQuotation ?? null
              )
            );
          }
        } catch (error: any) {
          startShowApiError(error.error);
          throw error;
        }
      },
    }),

    deleteManyHotelRoomTripDetails: builder.mutation<
      ApiResponse<HotelRoomTripDetailsEntity[]>,
      number[]
    >({
      query: (ids) => ({
        url: "/many/date",
        method: "DELETE",
        body: {
          ids,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["HotelRoomTripDetails"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          data.data.forEach((hotelRoomTripDetails) => {
            dispatch(deleteHotelRoomTripDetailsCache(hotelRoomTripDetails));
            if (hotelRoomTripDetails.tripDetails) {
              dispatch(
                onSetCurrentVersionQuotation(
                  hotelRoomTripDetails.tripDetails?.versionQuotation ?? null
                )
              );
            }
          });
          // startShowSuccess(data.message);
        } catch (error: any) {
          // startShowApiError(error.error);
          throw error;
        }
      },
    }),
  }),
});

export const {
  useGetAllHotelRoomTripDetailsQuery,
  useCreateHotelRoomTripDetailsMutation,
  useCreateManyHotelRoomTripDetailsMutation,
  useUpdateManyHotelRoomTripDetailsByDateMutation,
  useDeleteHotelRoomTripDetailsMutation,
  useDeleteManyHotelRoomTripDetailsMutation,
} = hotelRoomTripDetailsService;

//* Cache update
const updateHotelRoomTripDetailsCache = (
  hotelRoomTripDetails: HotelRoomTripDetailsEntity
) => {
  return hotelRoomTripDetailsService.util.updateQueryData(
    "getAllHotelRoomTripDetails",
    {
      tripDetailsId: hotelRoomTripDetails.id,
    },
    (draft) => {
      if (draft?.data) {
        draft.data.push(hotelRoomTripDetails);
      }
    }
  );
};

const deleteHotelRoomTripDetailsCache = (
  hotelRoomTripDetails: HotelRoomTripDetailsEntity
) => {
  return hotelRoomTripDetailsService.util.updateQueryData(
    "getAllHotelRoomTripDetails",
    {
      tripDetailsId: hotelRoomTripDetails.id,
    },
    (draft) => {
      if (draft?.data) {
        const index = draft.data.findIndex(
          (c) => c.id === hotelRoomTripDetails.id
        );
        if (index !== -1) draft.data.splice(index, 1);
      }
    }
  );
};
