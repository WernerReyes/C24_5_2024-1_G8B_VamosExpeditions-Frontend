import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { VersionQuotationEntity } from "@/domain/entities";
import type { ApiResponse } from "../response";
import {
  duplicateMultipleVersionQuotationDto,
  DuplicateMultipleVersionQuotationDto,
  versionQuotationDto,
  type VersionQuotationDto,
} from "@/domain/dtos/versionQuotation";
import { onSetCurrentVersionQuotation, onSetVersionQuotations, onUpsertVersionQuotation } from "../../slices/versionQuotation.slice";
import { startShowApiError } from "@/core/utils";
import { dateFnsAdapter } from "@/core/adapters";
import { quotationService } from "@/data";

const PREFIX = "/version-quotation";

export const versionQuotationService = createApi({
  reducerPath: "versionQuotationService",
  tagTypes: ["VersionQuotations", "VersionQuotation"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getAllVersionQuotations: builder.query<
      ApiResponse<VersionQuotationEntity[]>,
      void
    >({
      query: () => "/",
      providesTags: ["VersionQuotations"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(onSetVersionQuotations(data.data));
        } catch (error: any) {
          console.error(error);
          throw error;
        }
      },
      transformResponse: (response: ApiResponse<VersionQuotationEntity[]>) => {
        return {
          ...response,
          data: response.data.map((versionQuotation) => {
            return {
              ...versionQuotation,
              tripDetails: versionQuotation.tripDetails
                ? {
                    ...versionQuotation.tripDetails,
                    startDate: dateFnsAdapter.parseISO(
                      versionQuotation?.tripDetails.startDate
                    ),
                    endDate: dateFnsAdapter.parseISO(
                      versionQuotation?.tripDetails.endDate
                    ),
                  }
                : undefined,
            };
          }),
        };
      },
    }),

    updateVersionQuotation: builder.mutation<
      ApiResponse<VersionQuotationEntity>,
      VersionQuotationDto
    >({
      query: (versionQuotationDto) => ({
        url: "/",
        method: "PUT",
        body: versionQuotationDto,
      }),
      invalidatesTags: ["VersionQuotations"],

      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          //* Validate before sending
          const [_, errors] = versionQuotationDto.create(params);
          if (errors) throw errors;
          const { data } = await queryFulfilled;
          dispatch(onSetCurrentVersionQuotation(data.data));

          //* Update cache
          // upsertVerionQuotationCache(data.data);
          dispatch(onUpsertVersionQuotation(data.data));
        } catch (error: any) {
          console.error(error);
          startShowApiError(error.error);
          throw error;
        }
      },
    }),

    updateOfficialVersionQuotation: builder.mutation<
      ApiResponse<{
        unOfficial: VersionQuotationEntity;
        newOfficial: VersionQuotationEntity;
      }>,
      { quotationId: number; versionNumber: number }
    >({
      query: (versionQuotationDto) => ({
        url: "/official",
        method: "PUT",
        body: versionQuotationDto,
      }),
      invalidatesTags: ["VersionQuotations"],
      async onQueryStarted(params, { queryFulfilled, dispatch }) {
        try {
          //* Validate before sending
          if (!params.quotationId || !params.versionNumber) {
            throw "QuotationId and VersionNumber are required";
          }
          const { data } = await queryFulfilled;

          //* Update cache
          dispatch(onUpsertVersionQuotation(data.data.unOfficial));
          // upsertVerionQuotationCache(data.data.unOfficial);
          dispatch(onUpsertVersionQuotation(data.data.newOfficial));
          // upsertVerionQuotationCache(data.data.newOfficial);
        } catch (error: any) {
          startShowApiError(error.error);
          throw error;
        }
      },
    }),

    duplicateMultipleVersionQuotations: builder.mutation<
      ApiResponse<VersionQuotationEntity[]>,
      DuplicateMultipleVersionQuotationDto
    >({
      query: (ids) => ({
        url: "/duplicate-multiple",
        method: "POST",
        body: ids,
      }),
      invalidatesTags: ["VersionQuotations"],
      async onQueryStarted(params, { queryFulfilled, dispatch }) {
        try {
          //* Validate before sending
          const [_, errors] =
            duplicateMultipleVersionQuotationDto.create(params);
          if (errors) throw errors;

          const { data } = await queryFulfilled;

          //* Update cache
          data.data.forEach((versionQuotation) => {
            dispatch(onUpsertVersionQuotation(versionQuotation));

            // upsertVerionQuotationCache(versionQuotation);
          });
        } catch (error: any) {
          console.error(error);
          startShowApiError(error.error);
          throw error;
        }
      },
    }),

    getVersionQuotationById: builder.query<
      ApiResponse<VersionQuotationEntity>,
      {
        quotationId: number;
        versionNumber: number;
      }
    >({
      query: (id) => `/${id.quotationId}/${id.versionNumber}`,
      providesTags: ["VersionQuotation"],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        if (!params.quotationId || !params.versionNumber) {
          throw "QuotationId and VersionNumber are required";
        }
        try {
          const { data } = await queryFulfilled;
          dispatch(onSetCurrentVersionQuotation(data.data));
        } catch (error: any) {
          console.error(error);
          if (error.error.data) {
            await quotationService.deleteCurrentQuotation();
          }
          throw error;
        }
      },
    }),
  }),
});

export const {
  useGetAllVersionQuotationsQuery,
  useUpdateVersionQuotationMutation,
  useUpdateOfficialVersionQuotationMutation,
  useDuplicateMultipleVersionQuotationsMutation,
  useGetVersionQuotationByIdQuery,
} = versionQuotationService;

//* Cache Updates
const upsertVerionQuotationCache = (
  versionQuotation: VersionQuotationEntity
) => {
  versionQuotationService.util.updateQueryData(
    "getAllVersionQuotations",
    undefined,
    (draft) => {
      const index = draft.data.findIndex(
        (v) =>
          v.id.quotationId === versionQuotation.id.quotationId &&
          v.id.versionNumber === versionQuotation.id.versionNumber
      );
      if (index !== -1) {
        draft.data[index] = versionQuotation;
      } else {
        draft.data.push(versionQuotation);
      }
    }
  );
};
