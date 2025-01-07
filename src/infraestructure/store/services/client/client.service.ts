import { constantEnvs } from "@/core/constants/env.const";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "../response";
import type { ClientEntity } from "@/domain/entities";
import { RegisterClientDto } from "@/domain/dtos/client";

const { VITE_API_URL } = constantEnvs;

const PREFIX = "/client";

export const clientService = createApi({
  reducerPath: "clientService",
  baseQuery: fetchBaseQuery({
    baseUrl: VITE_API_URL + PREFIX,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerClient: builder.mutation<
      ApiResponse<ClientEntity>,
      RegisterClientDto
    >({
      query: (registerClientDto) => ({
        url: "/register",
        method: "POST",
        body: registerClientDto,
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
  useRegisterClientMutation,
  useGetClientByIdQuery,
  useGetAllClientsQuery,
} = clientService;
