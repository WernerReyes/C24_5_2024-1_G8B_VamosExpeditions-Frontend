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
} from "@/domain/dtos/hotelRoomQuotation";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { onSetHotelRoomQuotations } from "../../slices/hotelRoomQuotation.slice";

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
      query: () => "/",
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
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
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
  }),
});

export const {
  useLazyGetAllHotelRoomQuotationsQuery,
  useGetAllHotelRoomQuotationsQuery,
  useCreateHotelRoomQuotationMutation,
  useCreateManyHotelRoomQuotationsMutation,
  useDeleteHotelRoomQuotationMutation,
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
