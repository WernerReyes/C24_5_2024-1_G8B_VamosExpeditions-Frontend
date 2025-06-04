import { clientDto, ClientDto } from "@/domain/dtos/client";
import type { ClientEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse, PaginatedResponse } from "../response";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { clientCache } from "./client.cache";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";
import { AppState } from "@/app/store";
import { clientModel } from "@/infraestructure/models";
import { GetClientsDto, getClientsDto } from "@/domain/dtos/client/getClients";
import { trashDto, TrashDto } from "@/domain/dtos/common";

const PREFIX = "/client";

export const clientService = createApi({
  reducerPath: "clientService",
  tagTypes: ["Clients", "ClientsAll"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    upsertClient: builder.mutation<ApiResponse<ClientEntity>, ClientDto>({
      query: (body) => {
        //* Validate before sending
        const [_, errors] = clientDto.create(body);
        if (errors) {
          throw errors;
        }
        return {
          url: `/${body.id ? body.id : ""}`,
          method: body.id ? "PUT" : "POST",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);

          //* Update cache
          clientCache.upsertClient(data, dispatch, getState);

          versionQuotationCache.updateByClient(
            data.data,
            dispatch,
            getState as () => AppState
          );
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
      invalidatesTags: ["ClientsAll"],
    }),

    getAllClients: builder.query<ApiResponse<ClientEntity[]>, void>({
      query: () => "/",
      providesTags: ["Clients"],
    }),

    //! Get all clients with pagination
    getAllClientsPage: builder.query<
      ApiResponse<PaginatedResponse<ClientEntity>>,
      GetClientsDto
    >({
      query: (params) => {
        const [_, errors] = getClientsDto.create(params);
        if (errors) throw errors;

        return {
          url: "/page-all-clients",
          method: "GET",
          params: {
            ...params,
            isDeleted: false,
            select: clientModel.toString(params.select),
          },
        };
      },
      providesTags: ["ClientsAll"],
    }),
    //! Get clients that are in the trash
    getTrashClients: builder.query<
      ApiResponse<PaginatedResponse<ClientEntity>>,
      GetClientsDto
    >({
      query: (params) => {
        const [_, errors] = getClientsDto.create(params);
        if (errors) throw errors;

        return {
          url: "/page-all-clients",
          method: "GET",
          params: {
            ...params,
            isDeleted: true,
            select: clientModel.toString(params.select),
          },
        };
      },
      providesTags: ["ClientsAll"],
    }),
    //! delete client logic is handled in the client cache
    trashClient: builder.mutation<ApiResponse<ClientEntity>, TrashDto>({
      query: (body) => {
        const [_, errors] = trashDto.create(body);
        if (errors) throw errors;

        return {
          url: `/${body.id}/trash`,
          method: "PUT",
          body: {
            deleteReason: body.deleteReason,
          },
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      },
      invalidatesTags: ["ClientsAll"],
    }),

    restoreClient: builder.mutation<
      ApiResponse<ClientEntity>,
      ClientEntity["id"]
    >({
      query: (id) => {
        if (!id) throw new Error("ID is required");
        return {
          url: `/${id}/trash`,
          method: "PUT",
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      },
      invalidatesTags: ["ClientsAll"],
    }),
  }),
});

export const {
  useUpsertClientMutation,
  useGetAllClientsQuery,
  useGetAllClientsPageQuery,
  useGetTrashClientsQuery,
  useTrashClientMutation,
  useRestoreClientMutation,
} = clientService;
