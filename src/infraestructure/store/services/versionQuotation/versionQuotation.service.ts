import {
  duplicateMultipleVersionQuotationDto,
  type DuplicateMultipleVersionQuotationDto,
  getVersionQuotationsDto,
  type GetVersionQuotationsDto,
  sendEmailAndGenerateReportDto,
  type SendEmailAndGenerateReportDto,
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
  RestoreVersionQuotation,
  UpdateOfficialVersionQuotation,
} from "./versionQuotation.response";
import { reservationCache } from "../reservation/reservation.cache";
import type { AppState } from "@/app/store";
import { dateFnsAdapter } from "@/core/adapters";
import { trashDto, type TrashDto } from "@/domain/dtos/common";
import { versionQuotationModel } from "@/infraestructure/models";

const PREFIX = "/version-quotation";

export const versionQuotationService = createApi({
  reducerPath: "versionQuotationService",
  tagTypes: ["TrashQuotations", "OfficialQuotations", "UnofficialQuotations"],

  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getAllOfficialVersionQuotations: builder.query<
      ApiResponse<PaginatedResponse<VersionQuotationEntity>>,
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
            isDeleted: false,
            select: versionQuotationModel.toString(params.select),
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
      ApiResponse<PaginatedResponse<VersionQuotationEntity>>,
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
            isDeleted: false,
            select: versionQuotationModel.toString(params.select),
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

    getAllTrashVersionQuotations: builder.query<
      ApiResponse<PaginatedResponse<VersionQuotationEntity>>,
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
            // official: false,
            isDeleted: true,
            select: versionQuotationModel.toString(params.select),
          },
        };
      },

      providesTags: (result, _, __) => {
        return result
          ? [
              ...result.data.content.map((versionQuotation) => ({
                type: "TrashQuotations" as const,
                id: `${versionQuotation.id.quotationId}-${versionQuotation.id.versionNumber}`,
              })),
              { type: "TrashQuotations" as const, id: "PARTIAL-LIST" },
            ]
          : [{ type: "TrashQuotations" as const, id: "PARTIAL-LIST" }];
      },
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
          url: `/${body.userId}`,
          method: "PUT",
          body,
        };
      },

      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;

          //* Update the cache
          versionQuotationCache.update(
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
          versionQuotationCache.updateOfficial(
            data.data,
            dispatch,
            getState as () => AppState
          );
          versionQuotationCache.updateOfficial(
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
          versionQuotationCache.cancelAndReplaceApprovedOfficial(
            data.data,
            dispatch,
            getState as () => AppState
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
          versionQuotationCache.duplicateMultiple(
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

    trashVersionQuotation: builder.mutation<
      ApiResponse<VersionQuotationEntity>,
      TrashDto
    >({
      query: (body) => {
        //* Validate before sending
        const [_, errors] = trashDto.create(body);
        if (errors) throw errors;
        return {
          url: "/trash",
          method: "PUT",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;

          //* Update the cache
          versionQuotationCache.trash(
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

    restoreVersionQuotation: builder.mutation<
      ApiResponse<RestoreVersionQuotation>,
      VersionQuotationEntity["id"]
    >({
      query: (body) => {
        if (!body.quotationId || !body.versionNumber) {
          throw "QuotationId and VersionNumber are required";
        }
        return {
          url: "/restore",
          method: "PUT",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;

          //* Update the cache
          versionQuotationCache.restore(
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

    //!start pdf and excel
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
    //!excel
    generateVersionQuotationExcel: builder.query<
      Blob,
      { id: VersionQuotationEntity["id"]; name: string }
    >({
      query: ({ id }) => {
        if (!id.quotationId || !id.versionNumber) {
          throw "QuotationId and VersionNumber are required";
        }
        return {
          url: `/excel/${id.quotationId}/${id.versionNumber}`,
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
          hiddenElement.download = `${name}.xlsx`;
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
    //!end pdf and excel

    //! start preview pdf and excel
    previewVersionQuotationPdf: builder.query<
      Blob,
      VersionQuotationEntity["id"]
    >({
      query: (id) => {
        if (!id.quotationId || !id.versionNumber) {
          throw "QuotationId and VersionNumber are required";
        }
        return {
          url: `/pdf/${id.quotationId}/${id.versionNumber}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
    }),

    previewVersionQuotationExcel: builder.query<
      Blob,
      VersionQuotationEntity["id"]
    >({
      query: (id) => {
        if (!id.quotationId || !id.versionNumber) {
          throw "QuotationId and VersionNumber are required";
        }
        return {
          url: `/excel/${id.quotationId}/${id.versionNumber}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
    }),

    //! end preview pdf and excel

    sendEmailAndGenerateReport: builder.mutation<
      ApiResponse<void>,
      SendEmailAndGenerateReportDto
    >({
      query: (body) => {
        const [_, errors] = sendEmailAndGenerateReportDto.create(body);
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
  useGetAllOfficialVersionQuotationsQuery,
  useGetAllUnofficialVersionQuotationsQuery,
  useGetAllTrashVersionQuotationsQuery,
  useUpdateVersionQuotationMutation,
  useUpdateOfficialVersionQuotationMutation,
  useCancelAndReplaceApprovedOfficialVersionQuotationMutation,
  useDuplicateMultipleVersionQuotationsMutation,
  useTrashVersionQuotationMutation,
  useRestoreVersionQuotationMutation,
  useGetVersionQuotationByIdQuery,

  // pdf and excel
  useLazyGenerateVersionQuotationPdfQuery,

  //! start  preview pdf and excel
  useLazyPreviewVersionQuotationPdfQuery,
  useLazyPreviewVersionQuotationExcelQuery,
  //! end preview pdf and excel
  useLazyGenerateVersionQuotationExcelQuery,

  useSendEmailAndGenerateReportMutation,
} = versionQuotationService;
