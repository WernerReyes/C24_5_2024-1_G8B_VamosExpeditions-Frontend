import type { SettingEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";
import { updateSettingDto, type UpdateSettingDto } from "@/domain/dtos/setting";

const PREFIX = "/setting";

export const settingService = createApi({
  reducerPath: "settingService",
  tagTypes: ["Settings"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getSettings: builder.query<ApiResponse<SettingEntity[]>, void>({
      query: () => {
        return {
          url: "/",
          method: "GET",
        };
      },
      providesTags: ["Settings"],
    }),
    updateDinamicCleanUp: builder.mutation<
      ApiResponse<SettingEntity[]>,
      UpdateSettingDto
    >({
      query: (data) => {
        const [_, errors] = updateSettingDto.create(data);
        if (errors) {
          throw new Error(errors.join(", "));
        }
        return {
          url: `/dynamic-cleanup`,
          body: data,
          method: "PUT",
        };
      },
      invalidatesTags: ["Settings"],
    }),

    updateMaxActiveSessions: builder.mutation<
      ApiResponse<SettingEntity[]>,
      UpdateSettingDto
    >({
      query: (data) => {
        const [_, errors] = updateSettingDto.create(data);
        if (errors) {
          throw new Error(errors.join(", "));
        }
        return {
          url: `/max-active-session`,
          body: data,
          method: "PUT",
        };
      },
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateDinamicCleanUpMutation, useUpdateMaxActiveSessionsMutation } =
  settingService;
