import {
  duplicateMultipleVersionQuotationDto,
  DuplicateMultipleVersionQuotationDto,
  getVersionQuotationsDto,
  GetVersionQuotationsDto,
  sendEmailAndGenerateReportDto,
  SendEmailAndGenerateReportDto,
  versionQuotationDto,
  type VersionQuotationDto,
} from "@/domain/dtos/versionQuotation";
import type { VersionQuotationEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";

import {
  startShowApiError,
  startShowError,
  startShowSuccess,
} from "@/core/utils";
import { PaginatedResponse } from "../response";
import { versionQuotationCache } from "./versionQuotation.cache";
import type {
  CancelAndReplaceApprovedOfficialVersionQuotation,
  DeleteMultipleVersionQuotations,
  QuotationHasUnofficialVersions,
  TotalDraftsVersionQuotation,
  UpdateOfficialVersionQuotation,
} from "./versionQuotation.response";
import { reservationCache } from "../reservation/reservation.cache";
import type { AppState } from "@/app/store";
import { dateFnsAdapter } from "@/core/adapters";

const PREFIX = "/version-quotation";

export const versionQuotationService = createApi({
  reducerPath: "versionQuotationService",
  tagTypes: [
    "VersionQuotations",
    "VersionQuotation",
    "OfficialQuotations",
    "UnofficialQuotations",
  ],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getAllOfficialVersionQuotations: builder.query<
      ApiResponse<PaginatedResponse<QuotationHasUnofficialVersions>>,
      GetVersionQuotationsDto
    >({
      query: (params) => {
        //* Validate before sending
        const [_, errors] = getVersionQuotationsDto.create(params);
        if (errors) throw errors;
        return {
          url: "/",
          method: "GET",
          params: {
            ...params,
            official: true,
          },
        };
      },

      providesTags: (result, _, __) => {
        return result
          ? [
              ...result.data.content.map(({ id }) => ({
                type: "OfficialQuotations" as const,

                id: `${id.quotationId}-${id.versionNumber}`,
              })),
              {
                type: "OfficialQuotations" as const,

                id: "PARTIAL-LIST",
              },
            ]
          : [
              {
                type: "OfficialQuotations" as const,
                id: "PARTIAL-LIST",
              },
            ];
      },
    }),

    getAllUnofficialVersionQuotations: builder.query<
      ApiResponse<PaginatedResponse<QuotationHasUnofficialVersions>>,
      GetVersionQuotationsDto
    >({
      query: (params) => {
        //* Validate before sending
        const [_, errors] = getVersionQuotationsDto.create(params);
        if (errors) throw errors;
        return {
          url: "/",
          method: "GET",
          params: {
            ...params,
            official: false,
          },
        };
      },
      providesTags: (result, _, __) => {
        return result
          ? [
              ...result.data.content.map((versionQuotation) => ({
                type: "UnofficialQuotations" as const,
                id: `${versionQuotation.id.quotationId}-${versionQuotation.id.versionNumber}`,
              })),
              { type: "UnofficialQuotations" as const, id: "PARTIAL-LIST" },
            ]
          : [{ type: "UnofficialQuotations" as const, id: "PARTIAL-LIST" }];
      },
    }),

    getTotalDraftsVersionQuotations: builder.query<
      ApiResponse<TotalDraftsVersionQuotation>,
      void
    >({
      query: () => "/drafts",
    }),

    updateVersionQuotation: builder.mutation<
      ApiResponse<VersionQuotationEntity>,
      VersionQuotationDto
    >({
      query: (body) => {
        //* Validate before sending
        const [_, errors] = versionQuotationDto.create(body);
        if (errors) throw errors;
        return {
          url: "/",
          method: "PUT",
          body,
        };
      },

      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;

          //* Update the cache
          versionQuotationCache.updateVersionQuotation(
            data.data,
            dispatch,
            getState
          );
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),

    updateOfficialVersionQuotation: builder.mutation<
      ApiResponse<UpdateOfficialVersionQuotation>,
      VersionQuotationEntity["id"]
    >({
      query: (body) => {
        //* Validate before sending
        if (!body.quotationId || !body.versionNumber) {
          throw "QuotationId and VersionNumber are required";
        }
        return {
          url: "/official",
          method: "PUT",
          body: body,
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;

          //* Update the cache
          versionQuotationCache.updateOfficialVersionQuotation(
            data.data.newOfficial.official,
            data.data,
            dispatch,
            getState
          );
          versionQuotationCache.updateOfficialVersionQuotation(
            data.data.unOfficial.official,
            data.data,
            dispatch,
            getState
          );
        } catch (error: any) {
          startShowApiError(error.error);

          throw error;
        }
      },
    }),

    cancelAndReplaceApprovedOfficialVersionQuotation: builder.mutation<
      ApiResponse<CancelAndReplaceApprovedOfficialVersionQuotation>,
      VersionQuotationEntity["id"]
    >({
      query: (body) => {
        //* Validate before sending
        if (!body.quotationId || !body.versionNumber) {
          throw "QuotationId and VersionNumber are required";
        }
        return {
          url: "/cancel-replace",
          method: "PUT",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;

          //* Update the cache
          versionQuotationCache.cancelAndReplaceApprovedOfficialVersionQuotation(
            data.data,
            dispatch,
            getState
          );

          reservationCache.updateReservationFromAnotherService(
            data.data.newApproved,
            dispatch,
            getState as () => AppState
          );

          //* Show success message
          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),

    duplicateMultipleVersionQuotations: builder.mutation<
      ApiResponse<VersionQuotationEntity[]>,
      DuplicateMultipleVersionQuotationDto
    >({
      query: (body) => {
        //* Validate before sending
        const [_, errors] = duplicateMultipleVersionQuotationDto.create(body);
        if (errors) throw errors;
        return {
          url: "/duplicate-multiple",
          method: "POST",
          body,
        };
      },

      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;

          //* Update the cache
          versionQuotationCache.duplicateMultipleVersions(
            data.data,
            dispatch,
            getState
          );
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),

    getVersionQuotationById: builder.query<
      ApiResponse<VersionQuotationEntity>,
      VersionQuotationEntity["id"]
    >({
      query: (id) => {
        if (!id.quotationId || !id.versionNumber) {
          throw "QuotationId and VersionNumber are required";
        }
        return `/${id.quotationId}/${id.versionNumber}`;
      },
      // providesTags: (result, _, id) => {
      //   return result
      //     ? [
      //         {
      //           type: "VersionQuotation",
      //           id: `${id.quotationId}-${id.versionNumber}`,
      //         },
      //       ]
      //     : ["VersionQuotation"];
      // },
      providesTags: ["VersionQuotation"],

      transformResponse: (
        response: ApiResponse<VersionQuotationEntity>
      ): ApiResponse<VersionQuotationEntity> => {
        return {
          ...response,
          data: {
            ...response.data,
            tripDetails: response.data?.tripDetails
              ? {
                  ...response.data?.tripDetails,
                  hotelRoomTripDetails:
                    response.data?.tripDetails?.hotelRoomTripDetails?.map(
                      (hotelRoomTripDetails) => ({
                        ...hotelRoomTripDetails,
                        date: dateFnsAdapter.parseISO(
                          hotelRoomTripDetails.date
                        ),
                      })
                    ),
                }
              : undefined,
          },
        };
      },
    }),

    generateVersionQuotationPdf: builder.query<
      Blob,
      { id: VersionQuotationEntity["id"]; name: string }
    >({
      query: ({ id }) => {
        if (!id.quotationId || !id.versionNumber) {
          throw "QuotationId and VersionNumber are required";
        }
        return {
          url: `/pdf/${id.quotationId}/${id.versionNumber}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
      async onQueryStarted({ name }, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          const blobURL = URL.createObjectURL(data);
          const hiddenElement = document.createElement("a");
          hiddenElement.href = blobURL;
          hiddenElement.download = `${name}.pdf`;
          document.body.appendChild(hiddenElement);
          hiddenElement.click();
          document.body.removeChild(hiddenElement);
          setTimeout(() => {
            window.URL.revokeObjectURL(blobURL);
          }, 1000);
        } catch (error: any) {
          if (error.error)
            startShowError(
              "Versión de cotización no encontrada o no completado"
            );
        }
      },
    }),

    deleteMultipleVersionQuotations: builder.mutation<
      ApiResponse<DeleteMultipleVersionQuotations>,
      { ids: VersionQuotationEntity["id"][] }
    >({
      query: (body) => {
        if (!body.ids.length) {
          throw "Ids are required";
        }
        return {
          url: "/multiple",
          method: "DELETE",
          body,
        };
      },

      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          //* Update the cache
          versionQuotationCache.deleteMultipleVersions(
            data.data,
            dispatch,
            getState
          );
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),

    sendEmailAndGenerateReport: builder.mutation<
      ApiResponse<void>,
      SendEmailAndGenerateReportDto
    >({
      query: (body) => {
        const [_, errors] = sendEmailAndGenerateReportDto.create(body);
        console.log(errors);
        if (errors) throw new Error(errors[0]);
        return {
          url: `/send-email-pdf`,
          method: "POST",
          body: { ...body, to: body.to.map((item) => item.email) },
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);
        } catch (error: any) {
          startShowApiError(error.error);
          throw error;
        }
      },
    }),
  }),
});

export const {
  useGetTotalDraftsVersionQuotationsQuery,
  useGetAllOfficialVersionQuotationsQuery,
  useGetAllUnofficialVersionQuotationsQuery,
  useUpdateVersionQuotationMutation,
  useUpdateOfficialVersionQuotationMutation,
  useCancelAndReplaceApprovedOfficialVersionQuotationMutation,
  useDuplicateMultipleVersionQuotationsMutation,
  useGetVersionQuotationByIdQuery,
  useLazyGenerateVersionQuotationPdfQuery,
  useDeleteMultipleVersionQuotationsMutation,
  useSendEmailAndGenerateReportMutation,
} = versionQuotationService;
