import type { SettingEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";

const PREFIX = "/setting";

export const settingService = createApi({
  reducerPath: "settingService",
  tagTypes: ["Settings"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getSettings: builder.query<
      ApiResponse<SettingEntity>,
      void
    >({
      query: () => {
        
        return {
          url: "/",
          method: "GET",
          
        };
      },
      providesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery } = settingService;
