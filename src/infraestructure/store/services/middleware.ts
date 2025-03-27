import { constantEnvs } from "@/core/constants/env.const";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";

const { ENV_MODE } = constantEnvs;
/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  (_: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      if (ENV_MODE === "development") {
        console.error("Error: ", action.error);
      }
    }

    return next(action);
  };
