import { ApiResponse } from "@/config";
import { LoginDto } from "@/domain/dtos/auth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { LoginResponse } from "./auth.response";


const PREFIX = "/auth";

export const authService = createApi({
  reducerPath: "authService",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginDto>({
      query: (loginDto) => ({
        url: "/login",
        method: "POST",
        body: loginDto,
      }),
    }),

    userAuthenticated: builder.query<ApiResponse<LoginResponse>, void>({
      query: () => "/user-authenticated",
    }),
    logout: builder.query<null, void>({
      query: () => "/logout",
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyUserAuthenticatedQuery,
  useLazyLogoutQuery,
} = authService;
