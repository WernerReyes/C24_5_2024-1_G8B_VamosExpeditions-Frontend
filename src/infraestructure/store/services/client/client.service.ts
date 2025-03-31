import { clientDto, ClientDto } from "@/domain/dtos/client";
import type { ClientEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { clientCache } from "./client.cache";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";
import { AppState } from "@/app/store";

const PREFIX = "/client";

export const clientService = createApi({
  reducerPath: "clientService",
  tagTypes: ["Clients"],
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
           
          versionQuotationCache.updateVersionQuotationByClient(
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

    getAllClients: builder.query<ApiResponse<ClientEntity[]>, void>({
      query: () => "/",
      providesTags: ["Clients"],
    }),
  }),
});

export const {
  useUpsertClientMutation,
  useGetAllClientsQuery,
} = clientService;

