import type { ApiResponse } from "@/config";
import { CountryEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";

const PREFIX = "/country";

export const countryService = createApi({
  reducerPath: "countryService",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getCountries: builder.query<ApiResponse<CountryEntity[]>, void>({
      query: () => "/",
    }),
  }),
});

export const {
  useLazyGetCountriesQuery
} = countryService;