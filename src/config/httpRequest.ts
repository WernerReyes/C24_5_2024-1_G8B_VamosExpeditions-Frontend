import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { constantEnvs } from "@/core/constants/env.const";
import { setupInterceptors } from "./interceptors";

type Methods = "GET" | "POST" | "PUT" | "DELETE";

export type ApiResponse<T> = {
  data: T;
  message: string;
  status: number;
};

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
    const response: AxiosResponse<ApiResponse<T>> = await axios(
      `${VITE_API_URL}${url}`,
      {
        method,
        ...options,
        data,
        withCredentials: true,
      }
    );
    
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.data.status,
    };
  } catch (error) {
    throw error;
  }
};



setupInterceptors(axios);
