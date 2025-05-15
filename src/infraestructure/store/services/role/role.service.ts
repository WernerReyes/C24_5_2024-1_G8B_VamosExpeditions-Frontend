import { getRolesDto, GetRolesDto } from "@/domain/dtos/role";
import type { RoleEntity } from "@/domain/entities";
import { userModel } from "@/infraestructure/models";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse, PaginatedResponse } from "../response";

const PREFIX = "/role";

export const roleService = createApi({
  reducerPath: "roleService",
  tagTypes: ["Roles"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getRoles: builder.query<
      ApiResponse<PaginatedResponse<RoleEntity>>,
      GetRolesDto
    >({
      query: (params) => {
        const [_, errors] = getRolesDto.create(params);
        if (errors) throw errors;

        return {
          url: "/",
          method: "GET",
          params: {
            ...params,
            select: userModel.toString(params.select),
          },
        };
      },
      providesTags: ["Roles"],
    }),
  }),
});

export const { useGetRolesQuery } = roleService;
