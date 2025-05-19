import { constantEnvs } from "@/core/constants/env.const";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";

const { ENV_MODE } = constantEnvs;
/**
 * Log a warning and show a message in the extension if a network or cache error occurs.
 * Useful for API calls that are expected to fail, etc.
 */
export const rtkQueryErrorLogger: Middleware =
  (_: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      if (ENV_MODE === "development") {
        console.error("Error: ", action.payload);
      }
    }

    return next(action);
  };
