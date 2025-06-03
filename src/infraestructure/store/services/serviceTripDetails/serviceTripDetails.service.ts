import { startShowApiError, startShowSuccess } from "@/core/utils";
import type { ServiceTripDetailsEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import { ApiResponse } from "../response";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";
import type { AppState } from "@/app/store";
import {
  insertManyDetailsTripDetailsDto,
  updateManyDetailsTripDetailsByDateDto,
  UpdateManyDetailsTripDetailsByDateDto,
  type InsertManyDetailsTripDetailsDto,
} from "@/domain/dtos/common";

const PREFIX = "/service-trip-details";

export const serviceTripDetailsService = createApi({
  reducerPath: "serviceTripDetailsService",
  tagTypes: ["ServiceTripDetails"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    createManyServiceTripDetails: builder.mutation<
      ApiResponse<ServiceTripDetailsEntity[]>,
      InsertManyDetailsTripDetailsDto
    >({
      query: (body) => {
        const [_, errors] = insertManyDetailsTripDetailsDto.create(body);
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

          versionQuotationCache.addMultipleServiceTripDetails(
            data.data,
            dispatch,
            getState as () => AppState
          );

          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),
    updateManyServicesTripDetailsByDate: builder.mutation<
      ApiResponse<ServiceTripDetailsEntity[]>,
      UpdateManyDetailsTripDetailsByDateDto
    >({
      query: (body) => {
        const [_, errors] = updateManyDetailsTripDetailsByDateDto.create(body);
        if (errors) throw errors;
        return {
          url: "/many/date",
          method: "PUT",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          versionQuotationCache.updateManyServicesTripDetailsByDate(
            data.data,
            dispatch,
            getState as () => AppState
          );
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),
    deleteServiceTripDetails: builder.mutation<
      ApiResponse<ServiceTripDetailsEntity["id"]>,
      ServiceTripDetailsEntity["id"]
    >({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          versionQuotationCache.deleteManyServicesTripDetails(
            [data.data],
            dispatch,
            getState as () => AppState
          );
        } catch (error: any) {
          startShowApiError(error.error);
          throw error;
        }
      },
    }),
    deleteManyServicesTripDetails: builder.mutation<
      ApiResponse<ServiceTripDetailsEntity["id"][]>,
      ServiceTripDetailsEntity["id"][]
    >({
      query: (ids) => {
        if (!ids.length) {
          throw "No ids provided";
        }
        return {
          url: "/many/date",
          method: "DELETE",
          body: {
            ids,
          },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          versionQuotationCache.deleteManyServicesTripDetails(
            data.data,
            dispatch,
            getState as () => AppState
          );
        } catch (error: any) {
          startShowApiError(error.error);
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
  useUpdateManyServicesTripDetailsByDateMutation,
  useDeleteServiceTripDetailsMutation,
  useDeleteManyServicesTripDetailsMutation,

  //   useUpsertServiceTripDetailsMutation,
  //   useDeleteServiceTripDetailsMutation,
} = serviceTripDetailsService;
