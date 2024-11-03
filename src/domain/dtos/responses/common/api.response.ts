export enum ApiResponseStatus {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  WARNING = "WARNING",
}

export type ApiResponse<T> = {
  readonly status: ApiResponseStatus;
  readonly data: T;
  readonly message: string;
};
