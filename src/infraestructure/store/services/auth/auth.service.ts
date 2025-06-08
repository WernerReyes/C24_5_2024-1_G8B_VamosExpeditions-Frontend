import { startShowApiError, startShowSuccess } from "@/core/utils";
import {
  disconnectDeviceDto,
  DisconnectDeviceDto,
  loginDto,
  ResetPasswordDto,
  verify2FAAnfAuthenticateUserDto,
  Verify2FAAnfAuthenticateUserDto,
  type LoginDto,
} from "@/domain/dtos/auth";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  onLogin,
  onLogout,
  onRemoveDevice,
  onSetCurrentDeviceKey,
} from "../../slices/auth.slice";
import {
  onSetCookieExpiration,
  onSetExpired,
} from "../../slices/cookieExpiration.slice";
// import {} = "."
import { authService as authServiceDB } from "@/data";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";
import type {
  LoginResponse,
  LoginTwoFactorResponse,
  TwoFactorResponse
} from "./auth.response";
import { authSocket } from "./auth.socket";

const PREFIX = "/auth";

export const authService = createApi({
  reducerPath: "authService",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    login: builder.mutation<
      ApiResponse<LoginResponse | LoginTwoFactorResponse>,
      LoginDto
    >({
      query: (body) => {
        //* Validate before sending
        const [dto, errors] = loginDto.create(body);
        if (errors) throw errors;
        return {
          url: "/login",
          method: "POST",
          body: {
            ...dto,
            // deviceId: uuid(),
          },
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // await authServiceDB.upsertDeviceConnection(data.data.deviceId);
          if ("require2FA" in data.data) {
            //* 2FA is required
            return;
          }

          dispatch(onSetCurrentDeviceKey(data.data.deviceId));

          dispatch(
            onLogin({
              ...data.data.user,
              online: true,
            })
          );
          startShowSuccess(data.message);

          //* Connect to socket
          authSocket.userConnected();

          await authServiceDB.upsertDeviceConnection(data.data.deviceId);
        } catch (error: any) {
          if (error.error) {
            startShowApiError(error.error);
          }
        }
      },
    }),

    sendResetPasswordEmail: builder.mutation<ApiResponse<void>, string>({
      query: (email) => {
        return {
          url: "/send-reset-password-email",
          method: "POST",
          body: { email },
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
    }),

    verifyResetPasswordToken: builder.query<ApiResponse<void>, string>({
      query: (token) => {
        return {
          url: `/verify-reset-password-token/${token}`,
          method: "GET",
        };
      },
    }),

    resetPassword: builder.mutation<ApiResponse<void>, ResetPasswordDto>({
      query: (dto) => {
        return {
          url: "/reset-password",
          method: "POST",
          body: dto,
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

          //* Connect to socket
          authSocket.userConnected();
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      },
    }),

    generateTwoFactorAuthentication: builder.query<
      ApiResponse<TwoFactorResponse>,
      string
    >({
      query: (token) => ({
        url: `/generate-two-factor-authentication-secret/${token}`,
        method: "GET",
      }),
    }),

    verify2FAAnfAuthenticateUser: builder.mutation<
      ApiResponse<LoginResponse>,
      Verify2FAAnfAuthenticateUserDto
    >({
      query: (body) => {
        const [_, errors] = verify2FAAnfAuthenticateUserDto.create(body);
        if (errors) throw new Error(errors.join(", "));
        return {
          url: "/verify-two-factor-authentication",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(onLogin(data.data.user));
          dispatch(onSetCurrentDeviceKey(data.data.deviceId));
          startShowSuccess(data.message);

          //* Connect to socket
          authSocket.userConnected();
          await authServiceDB.upsertDeviceConnection(data.data.deviceId);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
    }),

    sendEmailToVerify2FA: builder.mutation<ApiResponse<void>, string>({
      query: (token) => {
        return {
          url: `/send-email-to-verify-2fa/${token}`,
          method: "POST",
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
    }),

    verify2FAEmail: builder.query<ApiResponse<LoginResponse>, string>({
      query: (token) => {
        return {
          url: `/verify-2fa/${token}`,
          method: "GET",
        };
      },
    }),

    setTokenFrom2FAEmail: builder.mutation<ApiResponse<LoginResponse>, string>({
      query: (token) => {
        return {
          url: `/set-token-from-2fa-email/${token}`,
          method: "POST",
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(onLogin({
            ...data.data.user,
            online: true,
          }));
          dispatch(onSetCurrentDeviceKey(data.data.deviceId));

          //* Connect to socket
          authSocket.userConnected();

          await authServiceDB.upsertDeviceConnection(data.data.deviceId);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      },
    }),

    userAuthenticated: builder.query<ApiResponse<LoginResponse>, void>({
      query: () => "/user-authenticated",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        dispatch(
          onLogin({
            ...data.data.user,
            online: true,
          })
        );

        dispatch(onSetCurrentDeviceKey(data.data.deviceId));
      },
    }),

    disconnectDevice: builder.mutation<ApiResponse<void>, DisconnectDeviceDto>({
      query: (body) => {
        const [_, errors] = disconnectDeviceDto.create(body);
        if (errors) throw new Error(errors.join(", "));
        return {
          url: "/disconnect-device",
          method: "POST",
          body,
        };
      },
      async onQueryStarted({ deviceId }, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);

          dispatch(onRemoveDevice(deviceId));
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
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

          //* Disconnect from socket
          authSocket.userDisconnected();
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSendResetPasswordEmailMutation,
  useVerifyResetPasswordTokenQuery,
  useResetPasswordMutation,
  useReLoginMutation,
  useGenerateTwoFactorAuthenticationQuery,
  useVerify2FAAnfAuthenticateUserMutation,
  useSendEmailToVerify2FAMutation,
  useVerify2FAEmailQuery,
  useSetTokenFrom2FAEmailMutation,
  useLazyUserAuthenticatedQuery,
  useUserAuthenticatedQuery,
  useDisconnectDeviceMutation,
  useLogoutMutation,
} = authService;
