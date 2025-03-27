import type { CountryEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";

const PREFIX = "/country";

export const countryService = createApi({
  reducerPath: "countryService",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getCountries: builder.query<ApiResponse<CountryEntity[]>, void>({
      query: () => "/",
      keepUnusedDataFor: 1000 * 60 * 60, //* 1 hour
    }),
  }),
});

export const { useGetCountriesQuery } = countryService;
