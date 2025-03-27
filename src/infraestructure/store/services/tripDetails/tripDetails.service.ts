import { startShowSuccess } from "@/core/utils";
import {
  tripDetailsDto,
  TripDetailsDto,
} from "@/domain/dtos/tripDetails";
import { VersionQuotationEntity, type TripDetailsEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { onSetCurrentTripDetails } from "../../slices/tripDetails.slice";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";
import { AppState } from "@/app/store";

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
        { showMessage = true, setCurrentTripDetails = true },
        { dispatch, queryFulfilled, getState }
      ) {
        try {
          const { data } = await queryFulfilled;

          versionQuotationCache.updateVersionQuotationByTripDetails(
            data.data,
            dispatch,
            getState as () => AppState
          );
          

          // if (setCurrentTripDetails)
          //   dispatch(onSetCurrentTripDetails(data.data));
          if (showMessage) startShowSuccess(data.message);
        } catch (error) {
          
          throw error;
        }
      },
    }),

    getTripDetailsByVersionQuotationId: builder.query<
      ApiResponse<TripDetailsEntity>,
      VersionQuotationEntity["id"]
    >({
      query: ({ quotationId, versionNumber }) => {
        if (!quotationId || !versionNumber) {
          throw "quotationId and versionNumber are required";
        }
        return {
        url: "/version-quotation",
        params: { quotationId, versionNumber },
      }},
      providesTags: ["TripDetail"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(onSetCurrentTripDetails(data.data));
        } catch (error: any) {
          if (error.error.status === 404) {
            dispatch(onSetCurrentTripDetails(null));
          }
          throw error;
        }
      },
    }),
  }),
});

export const {
  useUpsertTripDetailsMutation,
  useGetTripDetailsByVersionQuotationIdQuery,
} = tripDetailsServiceStore;
