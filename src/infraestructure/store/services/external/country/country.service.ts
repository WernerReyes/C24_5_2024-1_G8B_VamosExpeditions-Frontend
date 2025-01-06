import type { ApiResponse } from "@/config";
import { constantEnvs } from "@/core/constants/env.const";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ExternalCountryEntity } from "./country.entity";

const { VITE_API_URL } = constantEnvs;

const PREFIX = "/external/country";

export const externalCountryService = createApi({
  reducerPath: "externalCountryService",
  baseQuery: fetchBaseQuery({
    baseUrl: VITE_API_URL + PREFIX,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllExternalCountries: builder.query<ApiResponse<ExternalCountryEntity[]>, void>({
      query: () => "/",
    }),
  }),
});

export const {
  useGetAllExternalCountriesQuery,
} = externalCountryService;