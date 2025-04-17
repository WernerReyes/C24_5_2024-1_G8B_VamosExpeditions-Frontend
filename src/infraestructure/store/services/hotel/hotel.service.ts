import { getHotelsDto, type GetHotelsDto } from "@/domain/dtos/hotel";
import type { HotelEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";

const PREFIX = "/hotel";

export const hotelService = createApi({
  reducerPath: "hotelService",
  tagTypes: ["Hotels", "Hotel"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getHotels: builder.query<ApiResponse<HotelEntity[]>, GetHotelsDto>({
      query: (params) => {
        const [_, errors] = getHotelsDto.create(params);
        if (errors) throw errors;
        return {
          url: "/",
          method: "GET",
          params
        };
      },
      providesTags: ["Hotels"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          throw error;
        }
      },
      keepUnusedDataFor: 1000 * 60 * 60, //* 1 hour
    }),
  }),
});

export const {  useGetHotelsQuery } = hotelService;
