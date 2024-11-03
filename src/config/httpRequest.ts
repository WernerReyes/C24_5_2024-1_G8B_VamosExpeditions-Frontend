// import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
// import { getEnvs } from "@/presentation/utilities";
// import { setupInterceptors } from "./interceptors";
// import type { ApiResponse } from "@/domain/dtos";

// type Methods = "GET" | "POST" | "PUT" | "DELETE";

// const baseURL = getEnvs().VITE_API_URL;

// export const httpRequest = {
//   get: async <T>(
//     url: string,
//     options?: AxiosRequestConfig,
//   ): Promise<ApiResponse<T>> => {
//     return await request<T>(url, "GET", undefined, options);
//   },

//   post: async <T>(
//     url: string,
//     data?: any,
//     options?: AxiosRequestConfig,
//   ): Promise<ApiResponse<T>> => {
//     return await request<T>(url, "POST", data, options);
//   },

//   put: async <T>(
//     url: string,
//     data?: any,
//     options?: AxiosRequestConfig,
//   ): Promise<ApiResponse<T>> => {
//     return await request<T>(url, "PUT", data, options);
//   },

//   delete: async <T>(
//     url: string,
//     options?: AxiosRequestConfig,
//   ): Promise<ApiResponse<T>> => {
//     return await request<T>(url, "DELETE", undefined, options);
//   },
// };
// // try {
// //   const response: AxiosResponse<ApiResponse<T>> = await axios(
// //     `${baseURL}${url}`,
// //     {
// //       method,
// //       ...options,
// //       data,
// //     },
// //   );
// //   return {
// //     data: response.data.data,
// //     status: response.data.status,
// //     message: response.data.message,
// //   };
// // } catch (error) {
// //   throw error;
// // }

// const request = async <T>(
//   url: string,
//   method: Methods,
//   data?: any,
//   options?: AxiosRequestConfig,
// ): Promise<ApiResponse<T>> => {
//   try {
//     const response: AxiosResponse<ApiResponse<T>> = await axios(
//       `${baseURL}${url}`,
//       {
//         method,
//         ...options,
//         data,
//       },
//     );
//     return {
//       data: response.data.data,
//       status: response.data.status,
//       message: response.data.message,
//     };
//   } catch (error) {
//     throw error;
//   }
// };

// setupInterceptors(axios);
