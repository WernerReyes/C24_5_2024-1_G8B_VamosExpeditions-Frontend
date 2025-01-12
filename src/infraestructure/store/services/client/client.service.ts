import { constantEnvs } from "@/core/constants/env.const";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "../response";
import type { ClientEntity } from "@/domain/entities";
import { ClientDto } from "@/domain/dtos/client";

const { VITE_API_URL } = constantEnvs;

const PREFIX = "/client";

export const clientService = createApi({
  reducerPath: "clientService",
  baseQuery: fetchBaseQuery({
    baseUrl: VITE_API_URL + PREFIX,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createClient: builder.mutation<ApiResponse<ClientEntity>, ClientDto>({
      query: (createClientDto) => ({
        url: "/",
        method: "POST",
        body: createClientDto,
      }),
    }),

    updateClient: builder.mutation<
      ApiResponse<ClientEntity>,
      ClientDto & { id: number }
    >({
      query: (updateClientDto) => ({
        url: `/${updateClientDto.id}`,
        method: "PUT",
        body: updateClientDto,
      }),
    }),

    getClientById: builder.query<ApiResponse<ClientEntity>, string>({
      query: (id) => `/${id}`,
    }),
    getAllClients: builder.query<ApiResponse<ClientEntity[]>, void>({
      query: () => "/",
    }),
  }),
});

export const {
  useCreateClientMutation,
  useUpdateClientMutation,
  useGetClientByIdQuery,
  useLazyGetAllClientsQuery
} = clientService;
