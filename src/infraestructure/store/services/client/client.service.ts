import { clientDto, ClientDto } from "@/domain/dtos/client";
import type { ClientEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import { ApiResponse } from "../response";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { onSetSelectedClient } from "../../slices/client.slice";

const PREFIX = "/client";

export const clientService = createApi({
  reducerPath: "clientService",
  tagTypes: ["Client", "Clients"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    upsertClient: builder.mutation<ApiResponse<ClientEntity>, ClientDto>({
      query: (clientDto) => ({
        url: `/${clientDto.id ? clientDto.id : ""}`,
        method: clientDto.id ? "PUT" : "POST",
        body: clientDto,
      }),
      invalidatesTags: ["Clients"],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        //* Validate before sending
        const [_, errors] = clientDto.create(body);
        if (errors) return console.error(errors[0]);

        try {
          const { data } = await queryFulfilled;
          dispatch(upsertClientCache(data.data));

          dispatch(onSetSelectedClient(data.data));

          startShowSuccess(data.message);
        } catch (error: any) {
          console.error(error);
          startShowApiError(error.error);
          throw error;
        }
      },
    }),

    getClientById: builder.query<ApiResponse<ClientEntity>, string>({
      query: (id) => `/${id}`,
    }),
    getAllClients: builder.query<ApiResponse<ClientEntity[]>, void>({
      query: () => "/",
      providesTags: ["Clients"],
    }),
  }),
});

export const {
  useUpsertClientMutation,
  useGetClientByIdQuery,
  useLazyGetAllClientsQuery,
  useGetAllClientsQuery,
} = clientService;

//* Cache update
const upsertClientCache = (client: ClientEntity) => {
  return clientService.util.updateQueryData(
    "getAllClients",
    undefined,
    (draft) => {
      if (draft?.data) {
        const index = draft.data.findIndex((c) => c.id === client.id);
        if (index !== -1) draft.data[index] = client;
        else draft.data.push(client);
      }
    }
  );
};
