import type { AxiosResponse } from "axios";

// export enum ApiResponseStatus {
//   SUCCESS = "SUCCESS",
//   ERROR = "ERROR",
//   WARNING = "WARNING",
// }

export interface ApiResponse<T> extends AxiosResponse<T> {
  // readonly status: ApiResponseStatus;
  readonly data: T;
  readonly message: string;
}
