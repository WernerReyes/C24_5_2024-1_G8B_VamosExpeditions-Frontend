import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { VersionQuotationEntity } from "@/domain/entities";
import type { ApiResponse } from "../response";
import {
  versionQuotationDto,
  type VersionQuotationDto,
} from "@/domain/dtos/versionQuotation";
import { onSetCurrentVersionQuotation } from "../../slices/versionQuotation.slice";
import { startShowApiError } from "@/core/utils";

const PREFIX = "/version-quotation";

export const versionQuotationService = createApi({
  reducerPath: "versionQuotationService",
  tagTypes: ["VersionQuotations", "VersionQuotation"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
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
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    }),
  }),
});

export const {
  useUpdateVersionQuotationMutation,
  useGetVersionQuotationByIdQuery,
} = versionQuotationService;
