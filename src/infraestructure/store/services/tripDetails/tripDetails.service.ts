import type { AppState } from "@/app/store";
import { startShowSuccess } from "@/core/utils";
import { tripDetailsDto, TripDetailsDto } from "@/domain/dtos/tripDetails";
import {
  type TripDetailsEntity
} from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";

const PREFIX = "/trip-details";

export const tripDetailsServiceStore = createApi({
  tagTypes: ["TripDetails", "TripDetail"],
  reducerPath: "tripDetailsServiceStore",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    upsertTripDetails: builder.mutation<
      ApiResponse<TripDetailsEntity>,
      {
        tripDetailsDto: TripDetailsDto;
        showMessage?: boolean;
        setCurrentTripDetails?: boolean;
      }
    >({
      query: ({ tripDetailsDto: body }) => {
        //* Validate before sending
        const [_, errors] = tripDetailsDto.create(body);
        if (errors) throw errors;
        if (body.id) {
          return {
            url: `/${body.id}`,
            method: "PUT",
            body: body,
          };
        }
        return {
          url: "/",
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["TripDetails", "TripDetail"],
      async onQueryStarted(
        { showMessage = true },
        { dispatch, queryFulfilled, getState }
      ) {
        try {
          const { data } = await queryFulfilled;

          versionQuotationCache.updateVersionQuotationByTripDetails(
            data.data,
            dispatch,
            getState as () => AppState
          );

          if (showMessage) startShowSuccess(data.message);
        } catch (error) {
          throw error;
        }
      },
    }),
  }),
});

export const { useUpsertTripDetailsMutation } = tripDetailsServiceStore;
