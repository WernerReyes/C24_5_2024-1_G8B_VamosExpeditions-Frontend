import type { ApiResponse } from "@/config";
import { constantEnvs } from "@/core/constants/env.const";
import { CountryEntity } from "@/domain/entities";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const { VITE_API_URL } = constantEnvs;

const PREFIX = "/country";

export const countryService = createApi({
  reducerPath: "countryService",
  baseQuery: fetchBaseQuery({
    baseUrl: VITE_API_URL + PREFIX,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCountries: builder.query<ApiResponse<CountryEntity[]>, void>({
      query: () => "/",
    }),
  }),
});

export const {
  useLazyGetCountriesQuery
} = countryService;