import type { UserEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from '../response';

const PREFIX = "/user";

export const userService = createApi({
  reducerPath: "userService",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<UserEntity[]>, void>({
      query: () => "/",
    }),
  }),
});

export const { useGetUsersQuery } = userService;
