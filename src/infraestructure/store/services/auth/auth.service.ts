import { loginDto, type LoginDto } from "@/domain/dtos/auth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { LoginResponse } from "./auth.response";
import type { ApiResponse } from "../response";
import { onLogin, onLogout } from "../../slices/auth.slice";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { onSetCookieExpiration, onSetExpired } from "../../slices/cookieExpiration.slice";

const PREFIX = "/auth";

export const authService = createApi({
  reducerPath: "authService",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginDto>({
      query: (body) => {
        //* Validate before sending
        const [dto, errors] = loginDto.create(body);
        if (errors) throw errors;
        return {
        url: "/login",
        method: "POST",
        body: dto,
      }},
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(onLogin(data.data.user));
          startShowSuccess(data.message);
        } catch (error: any) {
          startShowApiError(error.error);
        }
      },
    }),

    reLogin: builder.mutation<ApiResponse<LoginResponse>, void>({
      query: () => {
        return {
          url: "/re-login",
          method: "POST",
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(onLogin(data.data.user));
          dispatch(onSetCookieExpiration(data.data.expiresAt));
          dispatch(onSetExpired(false));
          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      },
    }),

    userAuthenticated: builder.query<ApiResponse<LoginResponse>, void>({
      query: () => "/user-authenticated",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(onLogin(data.data.user));
        } catch (error: any) {}
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(onLogout());
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useReLoginMutation,
  useLazyUserAuthenticatedQuery,
  useUserAuthenticatedQuery,
  useLogoutMutation,
} = authService;
