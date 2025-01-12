import { constantEnvs } from "@/core/constants/env.const";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "../response";
import { CityEntity, CityEntitys } from "@/domain/entities";

const { VITE_API_URL } = constantEnvs;
const PREFIX = "/accommodation-room";

export const accommodationRoomService = createApi({
  reducerPath: "accommodationRoomService",
  baseQuery: fetchBaseQuery({
    baseUrl: VITE_API_URL + PREFIX,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    countryAndCity: builder.query<ApiResponse<CityEntitys>, CityEntity>({
      query: (data) => `/search/${data?.country.name}/${data?.name}`,
    }),
  }),
});

export const {
   useLazyCountryAndCityQuery

 } = accommodationRoomService;
