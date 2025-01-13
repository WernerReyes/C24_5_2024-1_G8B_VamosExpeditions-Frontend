import { constantEnvs } from "@/core/constants/env.const";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "../response";
import type { HotelEntity } from "@/domain/entities";
import type { GetHotelsDto } from "@/domain/dtos/hotel";

const { VITE_API_URL } = constantEnvs;
const PREFIX = "/hotel";

export const hotelService = createApi({
  reducerPath: "hotelService",
  baseQuery: fetchBaseQuery({
    baseUrl: VITE_API_URL + PREFIX,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getHotels: builder.query<ApiResponse<HotelEntity[]>, GetHotelsDto>({
      query: (getHotelsDto) => {
        return {
          url: "/",
          method: "GET",
          params: getHotelsDto,
        };
      },
    }),
  }),
});

export const { 
    useLazyGetHotelsQuery
 } = hotelService;
