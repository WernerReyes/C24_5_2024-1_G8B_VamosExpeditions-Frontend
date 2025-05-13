import { constantEnvs } from "@/core/constants/env.const";
import { detectBrowser } from "@/core/utils";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
const { VITE_API_URL } = constantEnvs;

export const requestConfig = (prefix: string) =>
  fetchBaseQuery({
    baseUrl: `${VITE_API_URL}/api/v1${prefix}`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      headers.set("X-Time-Zone", timeZone);
      headers.set("Browser-Name", detectBrowser());
      return headers;
    },
    // headers: {
    //   // "Content-Type": "application/json",
    //   "X-Time-Zone": Intl.DateTimeFormat().resolvedOptions().timeZone,
    // }
  });
