import { constantEnvs } from "@/core/constants/env.const";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
const { VITE_API_URL } = constantEnvs;

export const requestConfig = (prefix: string) =>
  fetchBaseQuery({
    baseUrl: `${VITE_API_URL}/api/v1${prefix}`,
    credentials: "include",
  });
