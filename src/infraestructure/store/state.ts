import type { AuthSliceState } from "./slices/auth.slice"
import { ClientSliceState } from "./slices/client.slice";
import type { QuoteSliceState } from "./slices/quote.slice";

export type AppState = {
    auth: AuthSliceState;
    quote: QuoteSliceState;
    client: ClientSliceState;

}