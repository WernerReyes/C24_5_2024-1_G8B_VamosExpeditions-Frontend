import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import { CityEntity } from "@/domain/entities";
import { ApiResponse } from "../response";
import { cityDto, CityDto } from "@/domain/dtos/city";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { countryService } from "../country/country.service";

const PREFIX = "/city";
export const cityService = createApi({
  reducerPath: "cityService",
    tagTypes: ["CityAll"],
  baseQuery: requestConfig(PREFIX),

  endpoints: (builder) => ({
    getCitiesAll: builder.query<ApiResponse<CityEntity[]>, void>({
      providesTags: ["CityAll"],
      query: () => "/all-city",
      keepUnusedDataFor: 1000 * 60 * 60, //* 1 hour
    }),

    // create and update
    upsertCity: builder.mutation<ApiResponse<CityEntity>, CityDto>({
      query: (body) => {
        const [_, errors] = cityDto.create(body);
        if (errors) throw errors;

        if (body.cityId !== 0) {
          return {
            url: `/${body.cityId}`,
            method: "PUT",
            body,
          };
        }

        return {
          url: "/",
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
      invalidatesTags: [{ type: "CityAll" }],
    }),
    // create and update
  }),
});
export const { useUpsertCityMutation, useGetCitiesAllQuery } = cityService;
