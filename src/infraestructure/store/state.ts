import type { AuthSliceState } from "./slices/auth.slice"

export type AppState = {
    auth: AuthSliceState;
}