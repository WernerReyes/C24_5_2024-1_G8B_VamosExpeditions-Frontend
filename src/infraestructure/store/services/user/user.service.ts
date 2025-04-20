import { AppState } from "@/app/store";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import {
  ChangePasswordDto,
  changePasswordDto,
  userDto,
  type UserDto,
} from "@/domain/dtos/user";
import type { UserEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { onLogin } from "../../slices/auth.slice";
import { setUsers } from "../../slices/users.slice";
import { requestConfig } from "../config";
import { reservationCache } from "../reservation/reservation.cache";
import type { ApiResponse } from "../response";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";
import { userCache } from "./user.cache";

const PREFIX = "/user";

export const userService = createApi({
  reducerPath: "userService",
  tagTypes: ["Users"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<UserEntity[]>, void>({
      query: () => "/",
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUsers(data.data));
        } catch (error) {
          throw error;
        }
      },
      providesTags: ["Users"],
    }),

    upsertUser: builder.mutation<ApiResponse<UserEntity>, UserDto>({
      query: (body) => {
        const [_, errors] = userDto.create(body);
        if (errors) throw errors;

        if (body.id !== 0) {
          return {
            url: `/${body.id}`,
            method: "PUT",
            body,
          };
        }

        return {
          url: "/",
          method: "POST",
          body,
        };
      },
      async onQueryStarted({ id }, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          if (id !== 0) {
            dispatch(onLogin(data.data));
          }

          userCache.upsertUser(data.data, dispatch, getState);

          versionQuotationCache.updateByUser(
            data.data,
            dispatch,
            getState as () => AppState
          );

          reservationCache.updateReservationByUser(
            data.data,
            dispatch,
            getState as () => AppState
          );

          startShowSuccess(data.message);
        } catch (error) {
          throw error;
        }
      },
    }),

    changePassword: builder.mutation<ApiResponse<void>, ChangePasswordDto>({
      query: (body) => {
        const [_, errors] = changePasswordDto.create(body);
        if (errors) throw errors;

        return {
          url: `/${body.id}/change-password`,
          method: "PUT",
          body,
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
  }),
});

export const {
  useGetUsersQuery,
  useUpsertUserMutation,
  useChangePasswordMutation,
} = userService;
