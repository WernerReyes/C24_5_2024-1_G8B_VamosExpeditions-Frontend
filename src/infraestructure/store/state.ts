import type { AuthSliceState } from "./slices/auth.slice"
import type { QuoteSliceState } from "./slices/quote.slice";

export type AppState = {
    auth: AuthSliceState;
    quote: QuoteSliceState;
}