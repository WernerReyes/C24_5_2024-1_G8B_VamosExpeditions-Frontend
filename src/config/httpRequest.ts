import axios, { AxiosRequestConfig } from "axios";
// import { setupInterceptors } from "./interceptors";

import { constantEnvs } from "@/core/constants/env.const";
import { ApiResponse } from "@/domain/dtos/responses/common";

type Methods = "GET" | "POST" | "PUT" | "DELETE";

const { VITE_API_URL } = constantEnvs;

export const httpRequest = {
  get: async <T>(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return await request<T>(url, "GET", undefined, options);
  },

  post: async <T>(
    url: string,
    data?: any,
    options?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return await request<T>(url, "POST", data, options);
  },

  put: async <T>(
    url: string,
    data?: any,
    options?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return await request<T>(url, "PUT", data, options);
  },

  delete: async <T>(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    return await request<T>(url, "DELETE", undefined, options);
  },
};

const request = async <T>(
  url: string,
  method: Methods,
  data?: any,
  options?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: ApiResponse<T> = await axios(`${VITE_API_URL}${url}`, {
      method,
      ...options,
      data,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

// setupInterceptors(axios);
