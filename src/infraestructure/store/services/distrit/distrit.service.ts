import { createApi } from "@reduxjs/toolkit/query/react";

import { requestConfig } from "../config";
import type { ApiResponse } from "../response";
import type { DistritEntity } from "@/domain/entities";
import { distritDto, DistritDto } from "@/domain/dtos/distrit";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { countryService } from "../country/country.service";

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
    // create and update
    upsertDistrit: builder.mutation<ApiResponse<DistritEntity>, DistritDto>({
      query: (body) => {
        const [_, errors] = distritDto.create(body);
        if (errors) throw errors;

        if (body.distritId !== 0) {
          return {
            url: `distrit/${body.distritId}`,
            method: "PUT",
            body,
          };
        }

        return {
          url: "distrit",
          method: "POST",
          body,
        };
      },
      async onQueryStarted({}, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);
          dispatch(
            countryService.util.invalidateTags([
              { type: "CountrysAndCityAndDistrits" },
            ])
          );
        } catch (error: any) {
          console.error(error);
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),
    // create and update
  }),
});

export const {
  useGetDistritsQuery,
  useGetDistritsAndCityQuery,
  useUpsertDistritMutation,
} = distritService;
