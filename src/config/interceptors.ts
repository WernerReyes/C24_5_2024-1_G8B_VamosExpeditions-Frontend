import { AxiosInstance } from "axios";
import { toasterAdapter } from "@/presentation/components";
import { getValidationError } from "@/core/utils";
import { constantErrorCode } from "@/core/constants";

export const setupInterceptors = (axiosInstance: AxiosInstance) => {
  //* Message interceptor
  axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (!error.response) {
        console.log(error)
        // const errorMsg = getValidationError(error.code);
        // toasterAdapter.error(errorMsg);
        // return Promise.reject({
        //   status: 500,
        //   message: "Error de conexión",
        // });
        return Promise.reject(error);
      }
      
      const code = error.response.data.code;

      console.log({ error });

      if (code === constantErrorCode.ERR_USER_INVALID_TOKEN) {
        // toasterAdapter.tokenExpired();
        return Promise.reject(error.response.data);
      }

      // const errorMsg = getValidationError(code);
      // if (errorMsg) {
      //   toasterAdapter.error(errorMsg);
      // }
      return Promise.reject(error.response.data);
    }
  );
};
