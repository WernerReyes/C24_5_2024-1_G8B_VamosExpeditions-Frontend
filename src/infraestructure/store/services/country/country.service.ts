import type { CountryEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";
import { countryDto, CountryDto } from "@/domain/dtos/country";
import { startShowApiError, startShowSuccess } from "@/core/utils";

const PREFIX = "/country";

export const countryService = createApi({
  reducerPath: "countryService",
  tagTypes: ["CountrysAndCityAndDistrits", "CountryAll"],
  baseQuery: requestConfig(PREFIX),

  endpoints: (builder) => ({
    getCountries: builder.query<ApiResponse<CountryEntity[]>, void>({
      query: () => "/",
      keepUnusedDataFor: 1000 * 60 * 60, //* 1 hour
    }),

    getCountriesAndCityAndDistrits: builder.query<
      ApiResponse<CountryEntity[]>,
      void
    >({
      query: () => "/country-city-distrit",
      providesTags: ["CountrysAndCityAndDistrits"],
      keepUnusedDataFor: 1000 * 60 * 60,
    }),

    // get all countries
    getCountriesAll: builder.query<ApiResponse<CountryEntity[]>, void>({
      providesTags: ["CountryAll"],
      query: () => "/all-country",
      keepUnusedDataFor: 1000 * 60 * 60,
    }),
    // get all countries

    // create and update
    upsertCountry: builder.mutation<ApiResponse<CountryEntity>, CountryDto>({
      query: (body) => {
        const [_, errors] = countryDto.create(body);
        if (errors) throw errors;

        if (body.countryId !== 0) {
          return {
            url: `/${body.countryId}`,
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
      async onQueryStarted({}, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);
        } catch (error: any) {
          console.error(error);
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
      invalidatesTags: ["CountrysAndCityAndDistrits", "CountryAll"],
    }),
    // create and update
  }),
});

export const {
  useGetCountriesQuery,
  useGetCountriesAndCityAndDistritsQuery,
  useUpsertCountryMutation,
  useGetCountriesAllQuery,
  
} = countryService;
