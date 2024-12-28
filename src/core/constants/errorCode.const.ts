export type ErrorCode = "ERR_NETWORK" | "ERR_USER_INVALID_TOKEN";

export const constantErrorCode: Record<ErrorCode, ErrorCode> = {
  ERR_NETWORK: "ERR_NETWORK",
  ERR_USER_INVALID_TOKEN: "ERR_USER_INVALID_TOKEN",
};
