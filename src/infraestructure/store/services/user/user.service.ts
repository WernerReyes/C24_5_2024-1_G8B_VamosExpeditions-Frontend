import type { AppState } from "@/app/store";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import {
  type ChangePasswordDto,
  changePasswordDto,
  createUserDto,
  CreateUserDto,
  type GetUsersDto,
  getUsersDto,
  userDto,
  type UserDto,
} from "@/domain/dtos/user";
import type { UserEntity } from "@/domain/entities";
import { userModel } from "@/infraestructure/models";
import { createApi } from "@reduxjs/toolkit/query/react";
import { onLogin } from "../../slices/auth.slice";
import { requestConfig } from "../config";
import { reservationCache } from "../reservation/reservation.cache";
import type { ApiResponse } from "../response";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";
import { userCache } from "./user.cache";
import type { PaginatedResponse } from "../response";
import { trashDto, TrashDto } from "@/domain/dtos/common";

const PREFIX = "/user";

export const userService = createApi({
  reducerPath: "userService",
  tagTypes: ["Users", "TrashUsers"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getUsers: builder.query<
      ApiResponse<PaginatedResponse<UserEntity>>,
      GetUsersDto
    >({
      query: (params) => {
        const [_, errors] = getUsersDto.create(params);
        if (errors) throw errors;

        return {
          url: "/",
          method: "GET",
          params: {
            ...params,
            isDeleted: false,
            select: userModel.toString(params.select),
          },
        };
      },
      providesTags: ["Users"],
    }),

    getTrashUsers: builder.query<
      ApiResponse<PaginatedResponse<UserEntity>>,
      GetUsersDto
    >({
      query: (params) => {
        const [_, errors] = getUsersDto.create(params);
        if (errors) throw errors;

        return {
          url: "/",
          method: "GET",
          params: {
            ...params,
            isDeleted: true,
            select: userModel.toString(params.select),
          },
        };
      },
      providesTags: ["TrashUsers"],
    }),

    updateUser: builder.mutation<ApiResponse<UserEntity>, UserDto>({
      query: (body) => {
        const [_, errors] = userDto.create(body);
        if (errors) throw errors;
          return {
            url: `/${body.id}`,
            method: "PUT",
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

    createUser: builder.mutation<ApiResponse<UserEntity>, CreateUserDto>({
      query: (body) => {
        const [_, errors] = createUserDto.create(body);
        if (errors) throw errors;

        return {
          url: "/",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;
          userCache.upsertUser(data.data, dispatch, getState);
          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      }
    }),

    trashUser: builder.mutation<ApiResponse<UserEntity>, TrashDto>({
      query: (body) => {
        const [_, errors] = trashDto.create(body);
        if (errors) throw errors;
        return {
          url: `/${body.id}/trash`,
          method: "PUT",
          body: {
            deleteReason: body.deleteReason,
          },
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;

          userCache.trash(data.data, dispatch, getState as () => AppState);

          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      },
    }),

    restoreUser: builder.mutation<ApiResponse<UserEntity>, UserEntity["id"]>({
      query: (id) => {
        if (!id) throw new Error("Id is required");

        return {
          url: `/${id}/restore`,
          method: "PUT",
        };
      },
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const { data } = await queryFulfilled;

          userCache.restore(data.data, dispatch, getState as () => AppState);

          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
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
  useGetTrashUsersQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useTrashUserMutation,
  useRestoreUserMutation,
  useChangePasswordMutation,
} = userService;
