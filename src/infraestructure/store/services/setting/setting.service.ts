import type { SettingEntity, SettingKeyEnum } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";
import { updateSettingDto, type UpdateSettingDto } from "@/domain/dtos/setting";
import { onUpdateSetting } from "../../slices/auth.slice";
import { startShowApiError } from "@/core/utils";

const PREFIX = "/setting";

export const settingService = createApi({
  reducerPath: "settingService",
  tagTypes: ["Settings", 
    "Setting"
  ],
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

    getByKey: builder.query<ApiResponse<SettingEntity>, SettingKeyEnum>({
      query: (key) => {
        return {
          url: `/${key}`,
          method: "GET",
        };
      },
      providesTags: ["Setting"],
    }),

    updateTwoFactorAuth: builder.mutation<
      ApiResponse<SettingEntity>,
      UpdateSettingDto
    >({
      query: (data) => {
        const [_, errors] = updateSettingDto.create(data);
        if (errors) {
          throw new Error(errors.join(", "));
        }
        return {
          url: `/two-factor-auth`,
          body: data,
          method: "PUT",
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(onUpdateSetting(data.data));
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      },
    }),

    updateDinamicCleanUp: builder.mutation<
      ApiResponse<SettingEntity>,
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
      
      invalidatesTags: ["Setting"],
    }),

    updateMaxActiveSessions: builder.mutation<
      ApiResponse<SettingEntity>,
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(onUpdateSetting(data.data));
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      },
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetByKeyQuery,
  useUpdateTwoFactorAuthMutation,
  useUpdateDinamicCleanUpMutation,
  useUpdateMaxActiveSessionsMutation,
} = settingService;
