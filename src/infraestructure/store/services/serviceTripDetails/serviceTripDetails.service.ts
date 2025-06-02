import { startShowApiError, startShowSuccess } from "@/core/utils";
import type { ServiceTripDetailsEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import { ApiResponse } from "../response";
import {
  insertManyServiceTripDetailsDto,
  type InsertManyServiceTripDetailsDto,
} from "@/domain/dtos/serviceTripDetails";

const PREFIX = "/service-trip-details";

export const serviceTripDetailsService = createApi({
  reducerPath: "serviceTripDetailsService",
  tagTypes: ["ServiceTripDetails"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    createManyServiceTripDetails: builder.mutation<
      ApiResponse<ServiceTripDetailsEntity[]>,
      InsertManyServiceTripDetailsDto
    >({
      query: (body) => {
        const [_, errors] = insertManyServiceTripDetailsDto.create(body);
        if (errors) throw errors;
        return {
          url: "/many",
          method: "POST",
          body: {
            ...body,
            countPerDay: body.countPerDay < 1 ? 1 : body.countPerDay,
          },
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;

          // versionQuotationCache.addMultipleHotelRoomTripDetails(
          //   data.data,
          //   dispatch,
          //   getState as () => AppState
          // );

          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),

    // upsertServiceTripDetails: builder.mutation<ApiResponse<ServiceTripDetailsEntity>, ServiceTripDetailsDto>({
    //   query: (body) => {
    //     const [_, errors] = serviceTripDetailsDto.create(body);
    //     if (errors) {
    //       throw errors;
    //     }
    //     return {
    //       url: `/${body.id ? body.id : ""}`,
    //       method: body.id ? "PUT" : "POST",
    //       body,
    //     };
    //   },
    //   invalidatesTags: ["ServiceTripDetails"],
    //   async onQueryStarted(_, { dispatch, queryFulfilled }) {
    //     try {
    //       const { data } = await queryFulfilled;
    //       startShowSuccess(data.message);
    //     } catch (error) {
    //       startShowApiError(error);
    //     }
    //   },
    // }),

    // deleteServiceTripDetails: builder.mutation<ApiResponse<ServiceTripDetailsEntity>, string>({
    //   query: (id) => ({
    //     url: `/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["ServiceTripDetails"],
    //   async onQueryStarted(_, { dispatch, queryFulfilled }) {
    //     try {
    //       const { data } = await queryFulfilled;
    //       startShowSuccess(data.message);
    //     } catch (error) {
    //       startShowApiError(error);
    //     }
    //   },
    // }),
  }),
});

export const {
  useCreateManyServiceTripDetailsMutation,

  //   useUpsertServiceTripDetailsMutation,
  //   useDeleteServiceTripDetailsMutation,
} = serviceTripDetailsService;
