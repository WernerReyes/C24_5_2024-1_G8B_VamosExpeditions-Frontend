import { loginDto, type LoginDto } from "@/domain/dtos/auth";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { LoginResponse } from "./auth.response";
import type { ApiResponse } from "../response";
import { onLogin, onLogout } from "../../slices/auth.slice";
import { startShowApiError, startShowSuccess } from "@/core/utils";

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
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const [_, errors] = loginDto.create(arg);
        if (errors) throw errors;
        try {
          const { data } = await queryFulfilled;
          dispatch(onLogin(data.data.user));
          startShowSuccess(data.message);
        } catch (error: any) {
          console.log("error", error);
          startShowApiError(error.error);
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
    logout: builder.query<null, void>({
      query: () => "/logout",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(onLogout());
        } catch (error: any) {
          console.log("error", error);
          startShowApiError(error.error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyUserAuthenticatedQuery,
  useUserAuthenticatedQuery,
  useLazyLogoutQuery,
} = authService;
