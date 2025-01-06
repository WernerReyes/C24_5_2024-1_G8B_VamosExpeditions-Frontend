import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginResponse } from "./auth.response";
import { LoginDto } from "@/domain/dtos/auth";
import { constantEnvs } from "@/core/constants/env.const";
import { ApiResponse } from "@/config";


const { VITE_API_URL } = constantEnvs;

const PREFIX = "/auth";





export const authService = createApi({
  reducerPath: "authService",
  baseQuery: fetchBaseQuery({
    baseUrl: VITE_API_URL + PREFIX,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginDto>({
      query: (loginDto) => ({
        url: "/login",
        method: "POST",
        body: loginDto,
      })
    }),

    userAuthenticated: builder.query<ApiResponse<LoginResponse>, void>({
      query: () => "/user-authenticated",
    }),
    logout: builder.query<null, void>({
      query: () => "/logout",
    }),
  }),
});

export const { useLoginMutation, useUserAuthenticatedQuery, useLogoutQuery } =
  authService;
