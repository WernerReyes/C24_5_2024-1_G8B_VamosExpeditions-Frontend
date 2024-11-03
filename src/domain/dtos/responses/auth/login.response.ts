export interface LoginResponse<T> {
  readonly user: T;
  readonly token: string;
}
