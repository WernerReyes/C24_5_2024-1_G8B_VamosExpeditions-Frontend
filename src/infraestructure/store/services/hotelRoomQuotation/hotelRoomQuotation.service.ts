import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { HotelRoomQuotationEntity } from "@/domain/entities";
import type { ApiResponse } from "../response";
import {
  getHotelRoomQuotationsDto,
  type GetHotelRoomQuotationsDto,
  hotelRoomQuotationDto,
  type HotelRoomQuotationDto,
  type InsertManyhotelRoomQuotationsDto,
  insertManyhotelRoomQuotationsDto,
  updateManyHotelRoomQuotationsByDateDto,
  UpdateManyHotelRoomQuotationsByDateDto,
} from "@/domain/dtos/hotelRoomQuotation";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { onSetHotelRoomQuotations } from "../../slices/hotelRoomQuotation.slice";
import { dateFnsAdapter } from "@/core/adapters";

const PREFIX = "/hotel-room-quotation";

export const hotelRoomQuotationService = createApi({
  reducerPath: "HotelRoomQuotationService",
  tagTypes: ["HotelRoomQuotations", "HotelRoomQuotation"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getAllHotelRoomQuotations: builder.query<
      ApiResponse<HotelRoomQuotationEntity[]>,
      GetHotelRoomQuotationsDto
    >({
      query: (params) => {
        return {
          url: "/",
          params,
        };
      },
      providesTags: ["HotelRoomQuotations"],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        const [_, errors] = getHotelRoomQuotationsDto.create(params);
        if (errors) throw errors;
        try {
          const { data } = await queryFulfilled;
          dispatch(onSetHotelRoomQuotations(data.data));
        } catch (error) {
          throw error;
        }
      },
      transformResponse: (
        response: ApiResponse<HotelRoomQuotationEntity[]>
      ) => {
        return {
          ...response,
          data: response.data.map((hotelRoomQuotation) => {
            return {
              ...hotelRoomQuotation,
              date: dateFnsAdapter.parseISO(hotelRoomQuotation.date),
            };
          }),
        };
      },
    }),
    createHotelRoomQuotation: builder.mutation<
      ApiResponse<HotelRoomQuotationEntity>,
      HotelRoomQuotationDto
    >({
      query: (hotelRoomQuotationDto) => ({
        url: "/",
        method: "POST",
        body: hotelRoomQuotationDto,
      }),
      invalidatesTags: ["HotelRoomQuotations"],

      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const [_, errors] = hotelRoomQuotationDto.create(body);
        if (errors) throw errors;
        try {
          const { data } = await queryFulfilled;
          dispatch(updateHotelRoomQuotationCache(data.data));
          startShowSuccess(data.message);
        } catch (error: any) {
          startShowApiError(error.error);
          throw error;
        }
      },
    }),
    createManyHotelRoomQuotations: builder.mutation<
      ApiResponse<HotelRoomQuotationEntity[]>,
      InsertManyhotelRoomQuotationsDto
    >({
      query: (hotelRoomQuotationsDto) => ({
        url: "/many",
        method: "POST",
        body: hotelRoomQuotationsDto,
      }),
      invalidatesTags: ["HotelRoomQuotations"],

      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const [_, errors] = insertManyhotelRoomQuotationsDto.create(body);
        if (errors) throw errors;
        try {
          const { data } = await queryFulfilled;
          data.data.forEach((hotelRoomQuotation) => {
            dispatch(updateHotelRoomQuotationCache(hotelRoomQuotation));
          });
          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),

    updateManyHotelRoomQuotationsByDate: builder.mutation<
      ApiResponse<HotelRoomQuotationEntity[]>,
      UpdateManyHotelRoomQuotationsByDateDto
    >({
      query: (params) => ({
        url: "/many/date",
        method: "PUT",
        body: params,
      }),
      invalidatesTags: ["HotelRoomQuotations"],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const [_, errors] =
            updateManyHotelRoomQuotationsByDateDto.create(body);
          if (errors) throw errors;
          const { data } = await queryFulfilled;
          data.data.forEach((hotelRoomQuotation) => {
            dispatch(updateHotelRoomQuotationCache(hotelRoomQuotation));
          });
          // startShowSuccess(data.message);
        } catch (error: any) {
          startShowApiError(error.error);
          throw error;
        }
      },
    }),

    deleteHotelRoomQuotation: builder.mutation<
      ApiResponse<HotelRoomQuotationEntity>,
      number
    >({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HotelRoomQuotations"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(deleteHotelRoomQuotationCache(data.data));
          // startShowSuccess(data.message);
        } catch (error: any) {
          startShowApiError(error.error);
          throw error;
        }
      },
    }),

    deleteManyHotelRoomQuotations: builder.mutation<
      ApiResponse<HotelRoomQuotationEntity[]>,
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
      invalidatesTags: ["HotelRoomQuotations"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          data.data.forEach((hotelRoomQuotation) => {
            dispatch(deleteHotelRoomQuotationCache(hotelRoomQuotation));
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
  useGetAllHotelRoomQuotationsQuery,
  useCreateHotelRoomQuotationMutation,
  useCreateManyHotelRoomQuotationsMutation,
  useUpdateManyHotelRoomQuotationsByDateMutation,
  useDeleteHotelRoomQuotationMutation,
  useDeleteManyHotelRoomQuotationsMutation,
} = hotelRoomQuotationService;

//* Cache update
const updateHotelRoomQuotationCache = (
  hotelRoomQuotation: HotelRoomQuotationEntity
) => {
  return hotelRoomQuotationService.util.updateQueryData(
    "getAllHotelRoomQuotations",
    {
      quotationId: hotelRoomQuotation?.versionQuotation?.quotationId,
      versionNumber: hotelRoomQuotation?.versionQuotation?.versionNumber,
    },
    (draft) => {
      if (draft?.data) {
        draft.data.push(hotelRoomQuotation);
      }
    }
  );
};

const deleteHotelRoomQuotationCache = (
  hotelRoomQuotation: HotelRoomQuotationEntity
) => {
  return hotelRoomQuotationService.util.updateQueryData(
    "getAllHotelRoomQuotations",
    {
      quotationId: hotelRoomQuotation?.versionQuotation?.quotationId,
      versionNumber: hotelRoomQuotation?.versionQuotation?.versionNumber,
    },
    (draft) => {
      if (draft?.data) {
        const index = draft.data.findIndex(
          (c) => c.id === hotelRoomQuotation.id
        );
        if (index !== -1) draft.data.splice(index, 1);
      }
    }
  );
};
