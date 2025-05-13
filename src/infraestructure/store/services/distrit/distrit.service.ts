import { createApi } from "@reduxjs/toolkit/query/react";

import { requestConfig } from "../config";
import type { ApiResponse } from "../response";
import type { DistritEntity } from "@/domain/entities";

const PREFIX = "/distrit";

export const distritService = createApi({
  reducerPath: "distritService",
  baseQuery: requestConfig(PREFIX),

  endpoints: (builder) => ({
    getDistrits: builder.query<ApiResponse<DistritEntity[]>, void>({
      query: () => "/",
      keepUnusedDataFor: 1000 * 60 * 60 * 60, 
    }),
    getDistritsAndCity: builder.query<ApiResponse<DistritEntity[]>, void>({
      query: () => "/",
      keepUnusedDataFor: 1000 * 60 * 60 * 60,
    }),
  }),
  
  
});

export const { 
  useGetDistritsQuery,
  useGetDistritsAndCityQuery,

 } = distritService;
