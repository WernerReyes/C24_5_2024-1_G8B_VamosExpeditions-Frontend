// import type { LoginDto } from "@/domain/dtos/auth";
// import { httpRequest } from "@/config";
// import type { LoginResponse } from "./auth.response";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginResponse } from "./auth.response";
import { LoginDto } from "@/domain/dtos/auth";
import { constantEnvs } from "@/core/constants/env.const";
import { ApiResponse } from "@/config";

// const PREFIX = "/auth";

// export const authService = {
//   login: async (loginDto: LoginDto) => {
//     try {
//       return await httpRequest.post<LoginResponse>(`${PREFIX}/login`, loginDto);
//     } catch (error) {
//       throw error;
//     }
//   },

//   userAuthenticated: async () => {
//     try {
//       return await httpRequest.get<LoginResponse>(
//         `${PREFIX}/user-authenticated`
//       );
//     } catch (error) {
//       throw error;
//     }
//   },

//   logout: async () => {
//     try {
//       return await httpRequest.post<null>(`${PREFIX}/logout`);
//     } catch (error) {
//       throw error;
//     }
//   },

// };

const { VITE_API_URL } = constantEnvs;

const PREFIX = "/auth";

export const authService = createApi({
  reducerPath: "authService",
  baseQuery: fetchBaseQuery({ baseUrl: VITE_API_URL + PREFIX,
    credentials: "include"
   }),
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginDto>({
      query: (loginDto) => ({
        url: "/login",
        method: "POST",
        body: loginDto,
      }),
    }),

    userAuthenticated: builder.query<ApiResponse<LoginResponse>, void>({
      query: () => "/user-authenticated",
    }),
    logout: builder.query<null, void>({
      query: () => "/logout",
    }),
  }),
});

export const { useLoginMutation, useUserAuthenticatedQuery, useLogoutQuery } =
  authService;
