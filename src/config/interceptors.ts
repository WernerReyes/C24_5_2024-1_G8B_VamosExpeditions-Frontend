// import axios, { AxiosInstance } from "axios";
// import daysjs from "dayjs";
// import {
//   errorMessage,
//   getEnvs,
//   getStorage,
//   setStorage,
//   StorageKeys,
// } from "@/presentation/utilities";
// import { JwtPayload, jwtDecode } from "jwt-decode";
// import type { ApiResponse } from "@/domain/dtos";

// const { TOKEN } = StorageKeys;

// const { VITE_API_URL } = getEnvs();

// const axiosInstanceForTokenRenewal = axios.create({
//   baseURL: VITE_API_URL,
// });

// export const setupInterceptors = (axiosInstance: AxiosInstance) => {
//   //* Token refresh interceptor
//   axiosInstance.interceptors.request.use(async (req) => {
//     let token = getStorage<string>("token")
//       ? getStorage<string>("token")
//       : null;

//     if (token) {
//       const user = jwtDecode<JwtPayload>(token);

//       const isExpired = daysjs.unix(user.exp!).diff(daysjs()) < 1;
//       if (!isExpired) {
//         req.headers.Authorization = `Bearer ${token}`;
//         return req;
//       }

//       const {
//         data: { data },
//       } = await axiosInstanceForTokenRenewal.post<ApiResponse<string>>(
//         `/auth/renovate-token?expiredToken=${token}`,
//       );
//       token = data;
//       req.headers.Authorization = `Bearer ${token}`;
//       setStorage(TOKEN, token);
//     }

//     return req;
//   });

//   axiosInstance.interceptors.response.use(
//     (res) => res,
//     (error) => {
//       console.error(error);
//       if (!error.response) {
//         const message = "Error Server, please try again later";
//         errorMessage([message]);
//         return Promise.reject({
//           status: 500,
//           message,
//         });
//       }

//       const errorMsg = error.response.data.error;
//       if (errorMsg) {
//         errorMessage([errorMsg]);
//       }
//       return Promise.reject(error.response.data);
//     },
//   );
// };
